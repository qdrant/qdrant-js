import * as fs from 'fs';

const openapiFile = fs.readFileSync('./src/openapi/generated_schema.ts', 'utf8');

function extractInterface(content: string, interfaceName: string): string | null {
    const interfaceRegex = new RegExp(`export\\s+interface\\s+${interfaceName}\\s*{`, 'g');
    const match = interfaceRegex.exec(content);

    if (match) {
        let braceCount = 1;
        const startIndex = match.index + match[0].length;
        let endIndex = startIndex;

        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
            } else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i + 1;
                    break;
                }
            }
        }

        return content.substring(match.index, endIndex);
    }

    return null;
}

function getInterfaceMembers(interfaceContent: string): string[] {
    const members: string[] = [];
    const braceIndex = interfaceContent.indexOf('{');
    const contentInsideBraces = interfaceContent.slice(braceIndex + 1, -1).trim();

    let currentMember = '';
    let braceCount = 0;

    for (const char of contentInsideBraces) {
        if (char === '{') {
            braceCount++;
        } else if (char === '}') {
            braceCount--;
        }

        if (braceCount === 0 && char === ';') {
            members.push(currentMember.trim());
            currentMember = '';
        } else {
            currentMember += char;
        }
    }

    if (currentMember.trim()) {
        members.push(currentMember.trim());
    }

    return members;
}

function getMemberNamesAndChildren(members: string[]): {name: string; children: {name: string; content: string}[]}[] {
    return members
        .map((member) => {
            // Remove leading comments and whitespace
            const cleanedMember = member.replace(/^\s*\/\/.*\n|\/\*[\s\S]*?\*\/\s*/g, '').trim();
            const nameMatch = cleanedMember.match(/^\s*(\w+)/);
            const name = nameMatch ? nameMatch[1] : '';

            const children: {name: string; content: string}[] = [];
            const braceIndex = cleanedMember.indexOf('{');

            if (braceIndex !== -1) {
                const contentInsideBraces = cleanedMember.slice(braceIndex + 1, cleanedMember.lastIndexOf('}')).trim();
                const childMembers = getInterfaceMembers(`{${contentInsideBraces}}`);
                childMembers.forEach((child) => {
                    const childNameMatch = child.match(/^\s*(\w+)/);
                    if (childNameMatch) {
                        children.push({name: childNameMatch[1], content: child.trim()});
                    }
                });
            }

            return {name, children};
        })
        .filter((member) => member.name !== '');
}

function extractQueryMembers(tsString: string): string[] {
    const queryRegex = /query\?:\s*{([^}]*)}/;
    const match = tsString.match(queryRegex);

    if (!match) {
        return [];
    }

    const queryContent = match[1];
    const memberRegex = /(\w+)\??:\s*[^;]+;/g;
    const members = [];
    let memberMatch;

    while ((memberMatch = memberRegex.exec(queryContent)) !== null) {
        members.push(memberMatch[1]);
    }

    return members;
}

function extractPathsInfo(input: string) {
    const pathRegex = /"([^"]+)":/;
    const commentRegex = /\/\*\*([^*]|(\*+[^*/]))*\*+\//g;
    const operationsRegex = /(get|post|put|delete|update|patch):\s*operations\["([^"]+)"\]/g;

    const pathMatch = input.match(pathRegex);
    const path: string = pathMatch ? pathMatch[1] : '';
    if (path === '') {
        throw new Error('Path not found');
    }

    const operations: Record<string, {operation: string; comment: string}> = {};
    let match;
    let commentMatch;
    while ((match = operationsRegex.exec(input)) !== null) {
        commentMatch = commentRegex.exec(input);
        const method = match[1];
        const operation = match[2];
        operations[method] = {
            operation,
            comment: commentMatch ? commentMatch[0] : '',
        };
    }

    return {path, operations};
}

function snakeToCamel(snake: string): string {
    return snake.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function addLeadingSpaces(input: string, n: number): string {
    const spaces = ' '.repeat(n);
    return input
        .split('\n')
        .map((line) => spaces + line)
        .join('\n');
}

const extractedOperations = extractInterface(openapiFile, 'operations');
let operationMembers;
if (extractedOperations) {
    operationMembers = getInterfaceMembers(extractedOperations);
} else {
    throw new Error('Interface `operations` from generated openapi not found.');
}

const operationMembersWithChildren = getMemberNamesAndChildren(operationMembers);

const extractedPaths = extractInterface(openapiFile, 'paths');
let pathMembers;
if (extractedPaths) {
    pathMembers = getInterfaceMembers(extractedPaths);
} else {
    throw new Error('Interface `paths` from generated openapi not found.');
}

const pathOperations: Record<string, {comment: string; path: string; method: string}> = {};
pathMembers.forEach((pathMember) => {
    const extracted = extractPathsInfo(pathMember);
    const path = extracted.path;
    for (const method in extracted.operations) {
        const operation = extracted.operations[method];
        pathOperations[operation.operation] = {
            path,
            comment: operation.comment,
            method,
        };
    }
});

const formattedOutput = operationMembersWithChildren
    .map((member) => {
        const operation = pathOperations[member.name];
        let result = operation.comment + `\n`;
        result += snakeToCamel(member.name) + `: TypedFetch<{\n`;
        member.children.forEach((child) => {
            result += addLeadingSpaces(child.content, 2) + `;\n`;
        });
        result += `}>;\n`;
        return result;
    })
    .join('\n');

const header = `// AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {components} from '../openapi/generated_schema.js';

export type ClientApi = {
`;

const output = header + addLeadingSpaces(formattedOutput, 2) + '}\n';

fs.writeFileSync('./src/openapi/generated_client_type.ts', output);

const formattedOutput2 = operationMembersWithChildren
    .map((member) => {
        const operation = pathOperations[member.name];

        const createParameters: string[] = [];
        member.children.forEach((child) => {
            if (child.name === 'parameters' && operation.method !== 'get') {
                extractQueryMembers(child.content).forEach((queryMember) => {
                    createParameters.push(queryMember);
                });
            }
        });

        let result = operation.comment + `\n`;
        result += snakeToCamel(member.name) + ':\n';
        result += `  client\n`;
        result += `  .path('${operation.path}')\n`;
        result += `  .method('${operation.method}')\n`;
        if (createParameters.length > 0) {
            result += `  .create({\n`;
            createParameters.forEach((param) => {
                result += `    ${param}: true,\n`;
            });
            result += `  }),\n`;
        } else {
            result += `  .create(),\n`;
        }
        return result;
    })
    .join('\n');

const pathsFileHeader = `// AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

import {Client} from '../api-client.js';
import {ClientApi} from './generated_client_type.js';

export function createClientApi(client: Client) : ClientApi {
  return {
`;

const pathsOutput = pathsFileHeader + addLeadingSpaces(formattedOutput2, 4) + '  }\n}\n';

fs.writeFileSync('./src/openapi/generated_api_client.ts', pathsOutput);
