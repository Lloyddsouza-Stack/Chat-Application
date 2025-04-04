const jwt= require("jsonwebtoken");

const authMiddleware= (req,res,next)=>{
    const token= req.header("Authorization");
    if (!token){
        return res.status(401).json({message: "No token provided. Access Denied."});
    }

    try{
        req.user=jwt.verify(token.split(" ")[1],process.env.JWT_SECRET);
        console.log(req.user)
        next();
    }catch(error){
        res.status(400).json({message:"Token is invalid."});
    }
};

module.exports= authMiddleware;
