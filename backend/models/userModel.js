import pool from "../config/db.js"

export const findUserByUsername =async(username)=>{
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE username =? LIMIT 1",[username]
    );

    return rows[0];
};

export const findUserById = async(id)=>{
    const [rows] =await pool.query(
        "SELECT * users WHERE id = ? LIMIT 1",[id]
    );

    return rows[0];
};

export const createUser = async (username ,password, role)=>{
    const [result] = await pool.query(
        `INSERT INTO users(username,password,role,status)
         VALUES (?,?,?,'active')`,
        [username,password,role]
    );

    return result.insertID
};
