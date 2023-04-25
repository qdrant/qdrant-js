---
'@qdrant/js-client-rest': patch
---

Fixes default parameter host=localhost resolving to ipv6 ::1 since Node 17 by using 127.0.0.1 instead.
