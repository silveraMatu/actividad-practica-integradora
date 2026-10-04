import "dotenv/config"

import { RoleRepository } from "../../modules/roles/role.repository.js";
import { db } from "../database/index.js";

//insert roles
const defaultRoles = ["admin", "operator", "user"]

const roleRepo = new RoleRepository()

async function seedRoles(): Promise<void> {
  const rolesToInsert = []
  
  for (const rol of defaultRoles) {
    const exist = await roleRepo.getByName(rol)
    if (exist) {
      console.log(`El rol ${exist.name} ya existe`)
      continue
    }
    rolesToInsert.push({ name: rol })
  }

  const createdRoles = await roleRepo.bulkCreate(rolesToInsert)
  for (const rol of createdRoles)
    console.log(` rol creado: ${rol.name}`)
}


async function seedDB() {
  try {
    await db.connect(
      process.env.MONGO_URI!,
      {
        dbName: process.env.MONGO_DB_NAME
      }      
    )
    //seeds para poblar la db
    await seedRoles()
    
  } catch (err: any) {
    console.log("Error ejecutando el seed", err)
  } finally {
    await db.disconnect()
  }
}

await seedDB()


