const usersModel = {
    getAll: `
    SELECT
        *
    FROM 
    disney_plus  
       `,

       getByID: `
       SELECT
          *
       FROM
       disney_plus
        WHERE
          show_id=?
       `,
      addRow: `
       INSERT INTO
       disney_plus(
        type, 
        title,
        director,
        country,
        release_year,
        rating,
        duration,
        listed_in
            )
         VALUES (
            ?,?,?,?,?,?,?,?
         )
       `,
       
       getByUsername:`
       SELECT
           *
       FROM
       disney_plus
      WHERE 
           title=?
       `,
       getByDirec:`
       SELECT
           *
       FROM
       disney_plus
      WHERE 
           director=?
       `,
      

  UpdateRow:`
    UPDATE
        disney_plus
    SET  
       type =?, 
        title=?,
        director=?,
        country=?,
        release_year=?,
        rating=?,
        duration=?,
        listed_in=?
   WHERE
   show_id=?  
  `, 
   DeleteRow:`
      DELETE FROM 
      disney_plus
      WHERE
      show_id=?
   `, 

};
module.exports = usersModel;