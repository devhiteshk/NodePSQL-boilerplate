#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const workspaceRoot = process.cwd();
const prismaSchemaPath = path.join(workspaceRoot, 'prisma', 'schema.prisma');

if (!fs.existsSync(prismaSchemaPath)) {
  console.error('No prisma/schema.prisma found. Aborting.');
  process.exit(1);
}

// flags: --mode=services|full  (default: services)
//        --no-overwrite         (don't overwrite existing files)
//        --no-backup            (don't create backups)
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`${name}=`));
  if (arg) return arg.split('=')[1];
  return null;
};
const mode = getArg('--mode') || 'services';
const noOverwrite = args.includes('--no-overwrite');
const noBackup = args.includes('--no-backup');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupRoot = path.join(workspaceRoot, '.gen-backup', timestamp);

// read schema
const schema = fs.readFileSync(prismaSchemaPath, 'utf8');

const modelRegex = /model\s+(\w+)\s*{([\s\S]*?)^}\s*$/gim;
let match;

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

const writeFile = (relPath, content) => {
  const outPath = path.join(workspaceRoot, relPath);
  const dir = path.dirname(outPath);
  ensureDir(dir);
  if (noOverwrite && fs.existsSync(outPath)) {
    console.log('Skip (exists):', relPath);
    return;
  }
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Wrote', relPath);
};

const toCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const genRoot = 'autoGen';

// backup logic removed: generator no longer creates backups. Use version control or copy files manually if you need backups.

// Note: the generator will not remove any existing `models/` directory to avoid deleting user code.

while ((match = modelRegex.exec(schema)) !== null) {
  const modelName = match[1];
  const body = match[2];

  // parse fields for @id and @unique
  const fieldLines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const fields = fieldLines.map((line) => {
    const parts = line.split(/\s+/);
    const name = parts[0];
    return {
      raw: line,
      name,
      attrs: line.includes('@unique') || line.includes('@id') ? line : '',
    };
  });

  const idField = fieldLines.find((l) => l.includes('@id'))?.split(/\s+/)[0] || 'id';
  const uniqueFields = fieldLines
    .filter((l) => l.includes('@unique') || l.includes('@id'))
    .map((l) => l.split(/\s+/)[0]);
  const uniqueLookupFields = uniqueFields.filter((f) => f !== idField);

  const modelVar = toCamel(modelName);

  // Only generate models if mode === 'full'
  if (mode === 'full') {
    const modelFile = `import prisma from '../db/prisma.js';

export const create${modelName} = async (data) => {
  return prisma.${modelVar}.create({ data });
};

export const find${modelName}ById = async (id) => {
  return prisma.${modelVar}.findUnique({ where: { ${idField}: id } });
};

export const find${modelName}s = async (where = {}) => {
  return prisma.${modelVar}.findMany({ where });
};

${uniqueLookupFields
  .map(
    (
      f
    ) => `export const find${modelName}By${f.charAt(0).toUpperCase() + f.slice(1)} = async (val) => {
  return prisma.${modelVar}.findUnique({ where: { ${f}: val } });
};`
  )
  .join('\n\n')}

export const update${modelName} = async (id, data) => {
  return prisma.${modelVar}.update({ where: { ${idField}: id }, data });
};

export const delete${modelName} = async (id) => {
  return prisma.${modelVar}.delete({ where: { ${idField}: id } });
};
`;

    writeFile(`${genRoot}/models/${modelVar}.js`, modelFile);
  }

  // service file (use prisma directly)
  const serviceFile = `import prisma from '../db/prisma.js';

export const create${modelName} = async (data) => {
  // add validation/business logic here
  return prisma.${modelVar}.create({ data });
};

export const get${modelName}ById = async (id) => prisma.${modelVar}.findUnique({ where: { ${idField}: id } });
export const list${modelName}s = async (where) => prisma.${modelVar}.findMany({ where });
${uniqueLookupFields.map((f) => `export const get${modelName}By${f.charAt(0).toUpperCase() + f.slice(1)} = async (val) => prisma.${modelVar}.findUnique({ where: { ${f}: val } });`).join('\n\n')}

export const update${modelName} = async (id, data) => prisma.${modelVar}.update({ where: { ${idField}: id }, data });
export const delete${modelName} = async (id) => prisma.${modelVar}.delete({ where: { ${idField}: id } });
`;

  writeFile(`${genRoot}/services/${modelVar}Service.js`, serviceFile);

  // controller file
  const controllerFile = `import * as service from '../services/${modelVar}Service.js';

export const create${modelName} = async (req, res) => {
  try {
    const item = await service.create${modelName}(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const get${modelName}ById = async (req, res) => {
  try {
    const item = await service.get${modelName}ById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: '${modelName} not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const list${modelName}s = async (req, res) => {
  try {
    const items = await service.list${modelName}s(req.query || {});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const update${modelName} = async (req, res) => {
  try {
    const item = await service.update${modelName}(Number(req.params.id), req.body);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const delete${modelName} = async (req, res) => {
  try {
    await service.delete${modelName}(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
`;

  writeFile(`${genRoot}/controllers/${modelVar}Controller.js`, controllerFile);

  // route file
  const routeFile = `import express from 'express';
import * as ctrl from '../controllers/${modelVar}Controller.js';

const router = express.Router();

router.post('/', ctrl.create${modelName});
router.get('/', ctrl.list${modelName}s);
router.get('/:id', ctrl.get${modelName}ById);
router.patch('/:id', ctrl.update${modelName});
router.delete('/:id', ctrl.delete${modelName});

export default router;
`;

  writeFile(`${genRoot}/routes/${modelVar}.js`, routeFile);
}

console.log('CRUD generation complete.');
