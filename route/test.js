exports.autoroute = {
    get: {
        
    },
    post: {
       
    },
    put: {
        '/test': test
    }
};

function test(req,res){
    console.log(1);
    res.apiSuccess();
}