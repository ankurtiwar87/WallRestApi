const wallModel = require("../models/wallpaper");


const createWall = async(req,res)=>{

    const {imgurl, cat} = req.body; 
   
    const newWall = new wallModel({
        imgurl:imgurl,
        cat:cat
    });
    try{
        await newWall.save();
        res.status(201).json(newWall);
     } catch(error){
      console.log(error);
     res.status(500).json({message: "Something went wrong!!"});
     }

}

const getWall = async(req,res)=>{
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter (default to 1)
    const limit = parseInt(req.query.limit) || 10; // Get the limit from query parameter (default to 10)
    try{
        const skip = (page - 1) * limit;
        const totalWallpapers = await wallModel.countDocuments();
        const wallpapers = await wallModel.find().skip(skip).limit(limit);

        const totalPages = Math.ceil(totalWallpapers / limit);

        res.status(200).json({
            page,
            totalPages,
            wallpapers
          });
          
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:"something webt wrong!!"});
    }
}

// const getCat = async (req, res) => {
//     const cat = req.query.cat; // Get category from query parameter
//     const page = parseInt(req.query.page) || 1; // Get page number from query parameter (default: 1)
//     const itemsPerPage = 10; // Number of items to display per page
  
//     try {
//       console.log(cat);
//       const totalCount = await wallModel.countDocuments({ cat });
//       const totalPages = Math.ceil(totalCount / itemsPerPage);
  
//       const documents = await wallModel
//         .find({ cat })
//         .skip((page - 1) * itemsPerPage)
//         .limit(itemsPerPage);
  
//       const imgUrls = documents.map(doc => doc.imgurl);
      
//       res.json({ imgUrls, totalPages, currentPage: page });
//     } catch (error) {
//       console.error('Error querying MongoDB:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

const getCat = async (req, res) => {
  const cat = req.query.cat; // Get category from query parameter
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter (default: 1)
  const itemsPerPage = 10; // Number of items to display per page

  try {
    console.log(cat);
    const totalCount = await wallModel.countDocuments({ cat });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const documents = await wallModel
      .find({ cat })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 }); // Sort by createdAt timestamp in descending order

    const wallpapers = documents.map(doc => ({
      _id: doc._id,
      createdAt: doc.createdAt,
      imgurl: doc.imgurl,
      updatedAt: doc.updatedAt
    }));

    res.json({
      wallpapers,
      totalPages,
      currentPage: page,
      category: cat,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {createWall, getWall,getCat};