# Agent AI Utilities

## Watch Method

```typescript
import { watch } from "agenti";

watch({
  projects: ["/path/to/your/project"], // replace to path of your project
  wildcards: [
    {
      name: "name-of-module", // ai module name should be there
      condition: "**/resource.md", // wildcard pattern matching
      processor: async (data) => {
        // YOUR CONTENT HERE
      },
    },
  ],
});
```
