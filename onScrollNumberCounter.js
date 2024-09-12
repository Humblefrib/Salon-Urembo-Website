const counters = document.querySelectorAll(".countersContainer span");
const container = document.querySelector(".countersContainer");

let activated = false;

window.addEventListener("scroll", () => {
    if(pageYOffset > container.offsetTop - container.offsetHeight - 500 && activated === false) {
        counters.forEach(counter => {
            counter.innerText = 0;

            let count = 0;

            function UpdateCount() {
                const target = parseInt(counter.dataset.count);

                if(count < target) {
                    count++;

                    counter.innerText = count;

                    setTimeout(UpdateCount, 10);
                }
                else {
                    counter.innerText = target;
                }
            }

            UpdateCount();

            activated = true;
        });
    }
    else if(pageYOffset < container.offsetTop - container.offsetHeight - 574 || pageYOffset === 0 && activated === true) {
        counters.forEach(counter => {
            counter.innerText = 0;
        });

        activated = false;
    }
});
