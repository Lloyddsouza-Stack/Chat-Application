const express= require("express");
const Message= require("../models/Message");
const authMiddleware= require("../middleware/authMiddleware");

const router= express.Router();

router.get("/:room", authMiddleware, async (req, res)=>{ // to get the message history for a specific room
    try{
        const message= await Message.find({room: req.params.room}).populate("sender","username");
        res.json(message);
    }catch(error){
        res.status(500).json({message: "server error."});
    }
});

router.put("/mark-read/:messageId", authMiddleware, async(req,res)=>{
    try{
        const message= await Message.findById(req.params.messageId); //Message=MongoDB schema, message= retrieved message
        if(!message){
            return res.status(404).json({message: "Message not found."});
        }
        message.read=true;
        await message.save();
        res.json({message: "message marked as read", messageId: message._id});
    }catch(error){
        res.status(500).json({message: "Internal server error."});
    }
});

router.delete("/:messageId", authMiddleware, async (req, res) => {  //  This route is to delete the messages
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Ensure only the sender can delete the message
        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(req.params.messageId);

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports=router;
