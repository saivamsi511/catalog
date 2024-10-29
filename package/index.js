const express = require("express");  
const bodyParser = require("body-parser");  
const bigInt = require("big-integer");  
const morgan = require("morgan");  

const app = express();  
const PORT = 3000;  

app.use(bodyParser.json());  
app.use(morgan("dev"))
function decodeValue(base, value) {  
    return value.split('').reverse().reduce((acc, digit, index) => {  
        return acc.add(bigInt(digit, 10).multiply(bigInt(base).pow(index))); 
    }, bigInt(0));  
}     
function lagrangeInterpolation(points) {  
    const k = points.length;  
    let c = bigInt(0);

    for (let i = 0; i < k; i++) {  
        let x_i = points[i][0];  
        let y_i = points[i][1]; 
        let L_i = bigInt(1);  
        for (let j = 0; j < k; j++) {  
            if (i !== j) {  
                L_i = L_i.multiply(bigInt(0).subtract(bigInt(points[j][0]))).divide(bigInt(x_i).subtract(bigInt(points[j][0])));  
            }  
        }  
        c = c.add(L_i.multiply(y_i));  
    }  
    return c;  
}  
 

app.post("/calculateSecretCode", (req, res) => {  
    try{
    const { keys, ...roots } = req.body;  

    const n = keys.n;  
    const k = keys.k;  
    const points = [];  
    for (const key in roots) {  
        const { base, value } = roots[key];  
        const x = parseInt(key);  
        const y = decodeValue(parseInt(base), value);  
        points.push([x, y]);  
    }   
    const secret = lagrangeInterpolation(points.slice(0, k));  

    res.json({ constantTerm: Math.abs(secret).toString() }).send(200);
 } catch(err){
    res.json({message:err.message}).status(500)
 }  
});  

app.get("/",(req,res)=>{
    res.send("Hello World").status(200)
})
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});