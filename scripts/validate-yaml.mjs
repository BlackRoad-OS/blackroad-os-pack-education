import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load } from "js-yaml";
import Ajv from "ajv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true, strict: false });

function readJsonSchema(relativePath) {
  const absolutePath = path.join(__dirname, "..", relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function readYaml(relativePath) {
  const absolutePath = path.join(__dirname, "..", relativePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  return load(content);
}

function validateFile(schema, relativePath) {
  const data = readYaml(relativePath);
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(`Validation failed for ${relativePath}`);
    console.error(validate.errors);
    process.exitCode = 1;
  } else {
    console.log(`Validated ${relativePath}`);
  }
}

const packSchema = readJsonSchema("schemas/pack.schema.json");
const courseSchema = readJsonSchema("schemas/course.schema.json");
const rubricSchema = readJsonSchema("schemas/rubric.schema.json");

validateFile(packSchema, "pack.yaml");

const curriculaDir = path.join(__dirname, "..", "curricula");
fs.readdirSync(curriculaDir)
  .filter((file) => file.endsWith(".yaml"))
  .forEach((file) => validateFile(courseSchema, path.join("curricula", file)));

const rubricsDir = path.join(__dirname, "..", "rubrics");
fs.readdirSync(rubricsDir)
  .filter((file) => file.endsWith(".yaml"))
  .forEach((file) => validateFile(rubricSchema, path.join("rubrics", file)));

if (process.exitCode) {
  process.exit(process.exitCode);
}
