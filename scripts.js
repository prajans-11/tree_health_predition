document.addEventListener('DOMContentLoaded', () => {
    const treeCount = 24; // Total number of trees
    const treeGrid = document.getElementById('tree-grid');
    const goodCountElem = document.getElementById('good-count');
    const badCountElem = document.getElementById('bad-count');
    const startSpeechBtn = document.getElementById('start-speech');
    
    let goodCount = 0;
    let badCount = 0;

    // Generate tree blocks
    for (let i = 1; i <= treeCount; i++) {
        const treeBlock = document.createElement('div');
        treeBlock.classList.add('tree-block');
        treeBlock.dataset.treeNumber = i; // Set data attribute for tree number
        
        const treeSymbol = document.createElement('div');
        treeSymbol.classList.add('tree-symbol');
        
        const treeNumber = document.createElement('div');
        treeNumber.classList.add('tree-number');
        treeNumber.innerText = i;

        treeBlock.appendChild(treeSymbol);
        treeBlock.appendChild(treeNumber);
        treeGrid.appendChild(treeBlock);
    }

    startSpeechBtn.addEventListener('click', startSpeechCommand);

    function startSpeechCommand() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            const words = transcript.split(" ");
            let treeNumber = null;
            let status = null;
            
            // Extract tree number and status from words
            words.forEach(word => {
                if (word.match(/^\d+$/)) {
                    treeNumber = parseInt(word);
                } else if (word === 'good' || word === 'bad') {
                    status = word;
                }
            });

            if (treeNumber !== null && status !== null) {
                const treeBlock = document.querySelector(`.tree-block[data-tree-number='${treeNumber}']`);
                
                if (treeBlock) {
                    const treeSymbol = treeBlock.querySelector('.tree-symbol');
                    
                    if (status === 'good') {
                        treeSymbol.classList.remove('bad');
                        treeSymbol.classList.add('good');
                        treeSymbol.innerHTML = '🌳'; // Use a tree emoji for visual representation
                        goodCount++;
                        goodCountElem.innerText = goodCount;
                    } else if (status === 'bad') {
                        treeSymbol.classList.remove('good');
                        treeSymbol.classList.add('bad');
                        treeSymbol.innerHTML = '🌳'; // Use a tree emoji for visual representation
                        badCount++;
                        badCountElem.innerText = badCount;
                    }
                } else {
                    alert('Invalid tree number');
                }
            } else {
                alert('Please say the tree number followed by "good" or "bad"');
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event);
            alert('An error occurred with speech recognition. Please try again.');
        };
    }
});
