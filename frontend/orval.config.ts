export default {
  api: {
    input: "http://localhost:8000/api/schema/",
    output: {
      mode: "tags-split",
      target: "./src/api",
      client: "react-query",
      schemas: "./src/api/model",
      override: {
        exclude: ["api/schema", "api/docs"],
        mutator: {
          path: "./src/api/client.ts",
          name: "customInstance",
        },
      },
    },
  },
};
