// import * as fs from 'fs';
// import * as path from 'path';

// // Paths
// const prismaDir = path.join(__dirname);
// const schemaPath = path.join(prismaDir, 'schema.prisma');
// const modelFiles = ['auth.prisma']; 

// // Read base schema (datasource + generator only)
// let schemaContent = fs.readFileSync(schemaPath, 'utf8') + '\n\n';

// // Append model files
// for (const file of modelFiles) {
//   const modelPath = path.join(prismaDir, file);
//   if (fs.existsSync(modelPath)) {
//     schemaContent += fs.readFileSync(modelPath, 'utf8') + '\n\n';
//   }
// }

// // Overwrite schema.prisma with merged version
// fs.writeFileSync(schemaPath, schemaContent.trim());
// console.log('✅ Schemas merged into schema.prisma');




