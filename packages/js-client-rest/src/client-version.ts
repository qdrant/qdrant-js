export const PACKAGE_VERSION = '1.12.0';

interface Version {
    major: number;
    minor: number;
}

export const ClientVersion = {
    /**
     * Parses a version string into a structured Version object.
     * @param version - The version string to parse (e.g., "1.2.3").
     * @returns A Version object.
     * @throws If the version format is invalid.
     */
    parseVersion(version: string): Version {
        if (!version) {
            throw new Error('Version is null');
        }

        let major = undefined;
        let minor = undefined;
        try {
            [major, minor] = version.split('.', 2);
            major = major.trim();
            minor = minor.trim();
            major = parseInt(major, 10);
            minor = parseInt(minor, 10);
        } catch (error) {
            throw new Error(`Unable to parse version, expected format: x.y[.z], found: ${version}`);
        }

        if (isNaN(major) || isNaN(minor)) {
            throw new Error(`Unable to parse version, expected format: x.y[.z], found: ${version}`);
        }
        return {
            major,
            minor,
        };
    },

    /**
     * Checks if the client version is compatible with the server version.
     * @param clientVersion - The client version string.
     * @param serverVersion - The server version string.
     * @returns True if compatible, otherwise false.
     */
    isCompatible(clientVersion: string, serverVersion: string): boolean {
        if (!clientVersion) {
            console.debug(`Unable to compare with client version: null`);
            return false;
        }

        if (!serverVersion) {
            console.debug(`Unable to compare with server version: null`);
            return false;
        }

        if (clientVersion === serverVersion) {
            return true;
        }

        try {
            const parsedClientVersion = ClientVersion.parseVersion(clientVersion);
            const parsedServerVersion = ClientVersion.parseVersion(serverVersion);

            const majorDiff = Math.abs(parsedClientVersion.major - parsedServerVersion.major);
            if (majorDiff >= 1) {
                return false;
            }

            return Math.abs(parsedClientVersion.minor - parsedServerVersion.minor) <= 1;
        } catch (error) {
            console.debug(`Unable to compare versions: ${error as string}`);
            return false;
        }
    },
};
