import "dotenv/config"

import { RoleRepository } from "../../modules/roles/role.repository.js";
import { UserRepository } from "../../modules/user/repository/user.repository.js";
import { db } from "../database/index.js";
import { bcryptService } from "../security/hasher/bcrypt.js";

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


//crear usuarios con distintos roles

const users = [
  { name: "admin", email: "admin@example.com", password: "admin123", rol: "admin" },
  { name: "operator", email: "operator@example.com", password: "operator123", rol: "operator" },
  { name: "user", email: "user@example.com", password: "user123", rol: "user" },
]

async function seedUsers(): Promise<void> {
  const userRepo = new UserRepository()
  const hasher = new bcryptService()
  
  for (const user of users) {
    //validar que el user exista
    const exist = await userRepo.findByEmail(user.email)
    if (exist) {
      console.log(`El usuario ${exist.name} ya existe`)
      continue
    }

    const hashedPassword = await hasher.hash(user.password)
    user.password = hashedPassword

    const role = await roleRepo.getByName(user.rol)
    if (!role) {
      console.log(`El rol ${user.rol} no existe`)
      continue
    }

    user.rol = role._id.toString()

    await userRepo.create({ ...user })
    console.log(`Usuario creado: ${user.name}`)
  }
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
    await seedUsers()
    
  } catch (err: any) {
    console.log("Error ejecutando el seed", err)
  } finally {
    await db.disconnect()
  }
}

await seedDB()


