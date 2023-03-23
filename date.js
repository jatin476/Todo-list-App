    const today = new Date();
    const Option = {
        weekday : 'long',
        day: 'numeric',
        month: 'long' ,
        //year: 'numeric'
    }
    const day = today.toLocaleDateString("en-US",Option);

module.exports = {day}