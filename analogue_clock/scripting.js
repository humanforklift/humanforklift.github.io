// declare 'hand' variables
const secondHand = document.querySelector('.second-hand'), minsHand = document.querySelector('.min-hand'), hourHand = document.querySelector('.hour-hand');
  
function setDate() {
    // get current time info
    const now = new Date(), seconds = now.getSeconds(), mins = now.getMinutes(), hour = now.getHours();
    
    // calculate how much secondHand moves on each 'tick' + rotate 90deg to allow for
    // initial rotation to set 12 o'clock at top of clock
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    
    // rotate secondHand appropriate amount
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    // calculate how much minsHand moves every second, allowing for 
    // initial rotation of 90deg
    const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;

    // calculate how much hourHand moves every second, allowing for 
    // initial rotation of 90deg
    const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  }
  
  // forces setDate function to run every second
  setInterval(setDate, 1000);

  setDate();