// document.addEventListener("DOMContentLoaded", () => {
//     const dashboardCards = document.querySelectorAll('.analytics-sparkle-line');
//     dashboardCards.forEach(c => {
//         generateRandomColor(c);
//     });
// });

function generateRandomGradient(element) {

    var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
    
    function populate(a) {
      for ( var i = 0; i < 6; i++ ) {
        var x = Math.round( Math.random() * 14 );
        var y = hexValues[x];
        a += y;
      }
      return a;
    }
    
    var newColor1 = populate('#');
    var newColor2 = populate('#');
    var angle = Math.round( Math.random() * 360 );
    
    var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
    
    element.style.background = gradient;
}

function generateRandomColor(element) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    element.style.backgroundColor = color;
}