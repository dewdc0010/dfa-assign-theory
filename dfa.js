const fin = "Accepted";
const rej = "Rejected : ";
const err = "Rejected : Invalid Character -> ";
//declare listDiv here so we can assign it later once the page is rendered
var listDiv = null;
var timeout;
var timeNextState = 2000;
//declare dfa in this js object
const zeroesThenOnesDFA = {
    s0: {
        h:"s1",
        m:"s2",
        l:"s3",
        c:"s0",
        1:"s0",
        2:"s0",
        3:"s0",
        s:"s0",
        isAccept:true,
        isTimer:false
    },
    s1: {
        1:"s4",
        2:"s5",
        3:"s6",
        c:"s0",
        h:"s1",
        m:"s2",
        l:"s3",
        isAccept:false,
        isTimer:false
    },
    s2: {
        1:"s4",
        2:"s5",
        3:"s6",
        c:"s0",
        h:"s1",
        m:"s2",
        l:"s3",
        isAccept:false,
        isTimer:false
    },
    s3: {
        1:"s4",
        2:"s5",
        3:"s6",
        c:"s0",
        h:"s1",
        m:"s2",
        l:"s3",
        isAccept:false,
        isTimer:false
    },
    s4: {
        s:"s7",
        c:"s0",
        1:"s4",
        2:"s5",
        3:"s6",
        h:"s4",
        m:"s4",
        l:"s4",
        isAccept:false,
        isTimer:false
    },
    s5: {
        s:"s8",
        c:"s0",
        1:"s4",
        2:"s5",
        3:"s6",
        h:"s5",
        m:"s5",
        l:"s5",
        isAccept:false,
        isTimer:false
    },
    s6: {
        s:"s9",
        c:"s0",
        1:"s4",
        2:"s5",
        3:"s6",
        h:"s6",
        m:"s6",
        l:"s6",
        isAccept:false,
        isTimer:false
    },
    s7: {
        s:"s7",
        1:"s7",
        2:"s7",
        3:"s7",
        c:"s0",
        h:"s7",
        m:"s7",
        l:"s7",
        isAccept:false,
        isTimer:false
    },
    s8: {
        s:"s8",
        1:"s8",
        2:"s8",
        3:"s8",
        c:"s0",
        h:"s8",
        m:"s8",
        l:"s8",
        isAccept:false,
        isTimer:false
    },
    s9: {
        s:"s9",
        1:"s9",
        2:"s9",
        3:"s9",
        c:"s0",
        h:"s9",
        m:"s9",
        l:"s9",
        isAccept:false,
        isTimer:false
    },
    s10:{
        c:"s0",
        isAccept:false,
        isTimer:true
    },
    s11:{
        c:"s0",
        isAccept:false,
        isTimer:true
    },
    s12:{
        c:"s0",
        isAccept:false,
        isTimer:true
    },
    s13:{
        isAccept:true,
        isTimer:false
    },
    //starting state should be declared exactly as the corresponding object key is
    startState: "s0",
    //vocabulary should be defined as a string with no delimiting
    vocabulary: "hml123scλ"
}

function getNextState(currentState, input){
    if(zeroesThenOnesDFA.vocabulary.includes(input)) {
        return zeroesThenOnesDFA[currentState][input];
    } else {
        document.getElementById("dfa_notification").classList.remove("alert-success");
        document.getElementById("dfa_notification").classList.add("alert-danger");
        document.getElementById("dfa_result").innerText = err + input;
        document.getElementById("dfa_notification").style.display = "block";
        document.getElementById("dfa_data").disabled = false;
        document.getElementById("dfa_go").disabled = false;
        return err + input;
    }
}

var timer;
//recursive function that does the heavy lifting
var text_return = function validateStream(inputString, currentState) {
    //console.log("Current : " + currentState);
    //console.log("inputString : " + inputString);
    //display the dfa's 'logic' on the page
    //drawTransition("Current State is: " + currentState + ", Remaining Input Stream: " + inputString);
    drawTransition(currentState,inputString);
    //check if we still have inputs to process
    if(inputString.length > 0) {
        //console.log(inputString.length);
        //get next state
        var nextState = getNextState(currentState, inputString[0]);
        //check if next state contains the error message, meaning there was an invalid input
        if(nextState.indexOf(err) !== -1){
            
            return nextState;
        } else {

            return timeout = setTimeout(function() { text_return(inputString.slice(1), nextState) }, timeNextState);
            //console.log(inputString);
            
            //return validateStream(inputString.slice(1), nextState);
        }
    } else if (zeroesThenOnesDFA[currentState].isAccept == true) {
        //check if current state is an acceptance state
        //console.log(fin);
        document.getElementById("dfa_result").innerText = '';
        document.getElementById("dfa_notification").classList.remove("alert-danger");
        document.getElementById("dfa_notification").classList.remove("alert-warning");
        document.getElementById("dfa_notification").classList.add("alert-success");
        document.getElementById("dfa_result").innerText = fin;
        document.getElementById("dfa_notification").style.display = "block";
        document.getElementById("dfa_data").disabled = false;
        document.getElementById("dfa_go").disabled = false;
        return fin;
    }else if(zeroesThenOnesDFA[currentState].isTimer == true) {
        document.getElementById("dfa_notification").classList.remove("alert-danger");
        document.getElementById("dfa_notification").classList.remove("alert-sucess");
        document.getElementById("dfa_notification").classList.add("alert-warning");
        document.getElementById("dfa_result").innerText = "00:00:00";
        $('#dfa_result').stopwatch().stopwatch('reset').stopwatch('stop');
        $('#dfa_result').stopwatch().bind('tick.stopwatch',function(e, elapsed){
            console.log(elapsed);
            if (elapsed >= timer) {
                $(this).stopwatch('stop').stopwatch('reset');
                $(this).unbind('tick.stopwatch');
                return  timeout = setTimeout(function() { text_return("", "s13") }, timeNextState);
            }
        }).stopwatch('start');

        document.getElementById("dfa_notification").style.display = "block";
    }else {
        
        if(currentState == 's7'){
            timer = 60000;
            return timeout = setTimeout(function() { text_return("", "s10") }, timeNextState);
        }else if(currentState == 's8'){
            timer = 120000;
            return timeout = setTimeout(function() { text_return("", "s11") }, timeNextState);
        }else if(currentState == 's9'){
            timer = 180000;
            return timeout = setTimeout(function() { text_return("", "s12") }, timeNextState);
        }else{
             //current state is not an acceptance state so it must be rejected
        console.log(rej + "stream ended at " + currentState);
        document.getElementById("dfa_notification").classList.remove("alert-sucess");
        document.getElementById("dfa_notification").classList.add("alert-danger");
        document.getElementById("dfa_result").innerText = rej + "Ended at -> " + currentState;
        document.getElementById("dfa_notification").style.display = "block";
        document.getElementById("dfa_data").disabled = false;
        document.getElementById("dfa_go").disabled = false;
        return rej + "Ended at " + currentState;
        }
    }
}

function drawTransition(output,inputString){

    //document.getElementById("dfa_image").src = "images/s0.png";
    document.getElementById("dfa_image").src = "images/"+output+".png";
    //document.getElementById("dfa_image1").src = "image/"+output+".png";
    document.getElementById("dfa_image1").src = "image/"+output+".gif";
    
    var node = document.createElement("li");
    listDiv.appendChild(node);
    var text = document.createTextNode(output + " : " + inputString);
    node.appendChild(text);

}

//function called when html button is pressed
function beginValidation(){
    var x = setTimeout(function(){

    document.getElementById("dfa_data").disabled = true;
    document.getElementById("dfa_go").disabled = true;
    document.getElementById("dfa_notification").style.display = "none";
    var input = document.getElementById("dfa_data").value;
    listDiv = document.getElementById("transitionList");
    //clear list from previous run
    listDiv.innerHTML = '';
    //run the dfa using the declared start state and store the output
    //var output = validateStream(input.trim(), zeroesThenOnesDFA.startState);
    var output = text_return(input.trim(), zeroesThenOnesDFA.startState);
    //var text = document.createTextNode(output);
    //console.log(text);
    //dfa_result.innerHTML = '';
    //diplay final state
    //dfa_result.appendChild(text);
    

    }, 500);

}
function design_by() {
    swal.fire({
        title: 'ผู้จัดทำ',
        html: "60010748 นางสาวเพ็ญพิชชา มงคลทิพย์วาที<br/>62015003 นายกฤษณพงศ์ บัวทองจันทร์<br/>62015005 นางสาวกันต์ดนย์ ทัพมาก<br/> "+
        "62015010 นายกิตติศักดิ์ จันทะเสน<br/>62015014 นางสาวจริญญา แสงวงศ์<br/>62015019 นายฉัตรชัย นพพลั้ง<br/>62015027 นายชยานนท์ ทองเจือ", 
        width: 600,
        padding: '1.5em',
        background: '#fff url(images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("images/nyan-cat.gif")
          left top
          no-repeat
        `
    });
}
function detail_dfa() {
    swal.fire({
        title:"รายละเอียดงาน",
        html: "h = เลือก High อุณหภูมิสูงสุด<br/>m = เลือก Medium อุณหภูมิปานกลาง<br/>l = เลือก Low อุณหภูมิต่ำสุด<br/>1 = เลือก 1 Minute เวลา 1 นาที<br/>2 = เลือก 2 Minute เวลา 2 นาที<br/>3 = เลือก 3 Minute เวลา 3 นาที<br/>s = เลือก Start เริ่มต้น<br/>c = เลือก Cancel ยกเลิก<br/><br/><br/>กรณี Accept<br/>- เลือก 'อุณหภูมิ' แล้วเลือก 'เวลา' แล้วเลือก 'เริ่มต้น' ระบบจะทำงาน<br/>- Cancel จะทำการย้อนกลับมาที่การเริ่มต้น<br/><br/><br/>**หมายเหตุ**<br/>- หากกดเลือกเวลาก่อน ระบบจะไม่ทำงาน<br/>- หากกดเริ่มต้นก่อน ระบบจะไม่ทำงานให้",
        width: 600,
        backdrop: `
        rgba(0,0,123,0.4)
      `
    });
}
function clearTime() {
    document.getElementById("dfa_data").disabled = false;
    document.getElementById("dfa_go").disabled = false;
    $('#dfa_result').stopwatch().stopwatch('reset').stopwatch('stop');
    document.getElementById("dfa_result").innerText = '';
    document.getElementById("dfa_notification").style.display = "none";
    document.getElementById("dfa_image1").src = "image/s0.gif";
    document.getElementById("dfa_image").src = "images/s0.png";
    clearTimeout(timeout);
}