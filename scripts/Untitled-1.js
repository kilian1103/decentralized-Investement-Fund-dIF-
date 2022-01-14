
const delay = ms => new Promise(res => setTimeout(res, ms));

const yourFunction = async () => {
    await delay(5000);
    console.log("Waited 5s");
  };


  function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  
 wait(5000);
  console.log("amk");