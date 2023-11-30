const{request, response}=require('express')
const usersModel = require('../models/users')
const pool = require('../db');

const usersList= async (req=request,res=response)=>{
    let conn;
    try{
       conn = await pool.getConnection();
    
       const users = await conn.query(usersModel.getAll,(err) => {
        if(err){
           throw new Error(err);
        }
       })
res.json(users);
    }catch (err){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

const listUserByID= async (req=request,res=response)=>{
    const{id} = req.params;

    if (isNaN(id)){
        res.status(400).json({msg:'ID invalido'});
        return;
    }

    let conn;
    try{
       conn = await pool.getConnection();
    
       const [user] = await conn.query(usersModel.getByID, [id] ,(err) => {
        if(err){
           throw new Error(err);
        }
       })

       if (!user){
        res.status(404).json({msg:"Pelicula no encotrada"});
        return;
       }

res.json(user);
    }catch (err){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

/*////////////////////////////////////////////////////////////////////////////7*/
const adduser = async (req = request, res=response) =>{
    const {
        type, 
        title,
        director,
        country,
        release_year,
        rating,
        duration,
        listed_in,
     } = req.body;
 
    if(!type || !title || !director|| !country || !release_year|| !rating || !duration || !listed_in){
        res.status(400).json({msg:'Información no encotrada'});
        return;
    }
   
    const user = [type, title, director,
        country,
        release_year,
        rating,
        duration,
        listed_in];

    let conn;
    try{
        conn=await pool.getConnection();
     
    const [usernameUser] = await conn.query(
        usersModel.getByUsername,
        [title],
        (err) => {if (err) throw err;}
    );
    if (usernameUser){
        res.status(409).json({msg:`La pelicula con el titulo ${title} ya existe`});
    return;
    }/** */
    

const userAdded = await conn.query(
    usersModel.addRow,
    [...user],
    (err) =>{if(err) throw err;}
    )

if  (userAdded.affectedRows === 0) throw new Error ({msg:'No se pudo agragar la pelicula'});
res.json({msg:'Pelicula agregada exitosamente'});
} catch (error) {
    console.log(error);
    res.status(500).json(error);
} finally {
    if (conn) conn.end();
}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteUsers=async(req=request, res=response)=>{
    let conn;
    try{
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] =await conn.query(
            usersModel.getByID,
            [id],
            (err) =>{if(err)throw err;}
        );
       if (!userExists){
        res.status(404).json({msg:'Información no econtrada'});
        return;
       }
       const userDeleted = await conn.query(
          usersModel.DeleteRow,
          [id],
          (err)=>{if (err) throw err;}
       );
       if (userDeleted.affectedRows===0) {
        throw new Error ({msg:'Error al eliminar la información'})
    };
    res.json({msg:'Información eliminada con éxito'})

    }catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

/*----------------------------------------------------------------------------------*/
const UpdateUser = async (req = request, res=response) =>{
    const {
        type, 
        title,
        director,
        country,
        release_year,
        rating,
        duration,
        listed_in,
     } = req.body;

     const {id}=req.params;
 
    let newUserData =[
        type, 
        title,
        director,
        country,
        release_year,
        rating,
        duration,
        listed_in,
    ]
      
     let conn;

     try{
        conn =await pool.getConnection();
        const [userExists] =await conn.query(
            usersModel.getByID,
            [id],
            (err) =>{if(err)throw err;}
        );
       if (!userExists ){
        res.status(404).json({msg:'Información no encontrada'});
        return;
       }
       if (title){
       const [usernameUser] = await conn.query(
        usersModel.getByUsername,
        [title],
        (err) => {if (err) throw err;}
    );
    if (usernameUser){
        res.status(409).json({msg:`La pelicula con el titulo ${title} ya existe`});
    return;
       }

       }
const oldUserData =[
userExists.type,
userExists.title,
userExists.director,
userExists.country,
userExists.release_year,
userExists.rating,
userExists.duration,
userExists.listed_in
];
newUserData.forEach((userData, index)=>{
if(!userData){
    newUserData[index]= oldUserData[index];

}
});
const userUpdate =await conn.query(
    usersModel.UpdateRow,
    [...newUserData,id],
    (err)=>{if(err) throw err;}
);

if(userUpdate.affectedRows === 0){
throw new Error ('La información no ha sido actualizada');
}

res.json({msg:'Información actualizada con exito'})
     }catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}
/*--------------------------------------------*/

const buscar = async (req = request, res =response)=>{
    let conn;
    const{director}=req.body;
    
        if(!director){
            res.status(400).json({msg:"Se requiere nombre del director"});
            return;
        }
        try{ 
            conn = await pool.getConnection();
        const [direc]=await conn.query(
            usersModel.getByDirec,
            [director],
            (err)=>{if(err)throw err;}
        )
        if(!direc){
            res.status(404).json({msg:'Director no encontrado'})
            return;
        }

        
    res.json(direc);
        }catch (error){
            console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
    }



module.exports={usersList, listUserByID, adduser,deleteUsers,UpdateUser,buscar}; 