const Message= require("../models/Message");
const authMiddleware= require("../middleware/authMiddleware");
const express= require("express");

const router= express.Router();

router.get("/private/:user1/:user2", authMiddleware, async (req,res)=>{
    try{
        const {user1, user2}=req.params;
        const privateRoom= [user1,user2].sort().join("_");

        const message= await Message.find({room: privateRoom}).populate("sender","username");
        res.json(message);
    }catch(error){
        res.status(500).json({message: "Internal server error."});
    }
});

module.exports=router;