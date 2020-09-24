const form = document.querySelector('form');
const table = document.querySelector('.table');
const tagTable = document.querySelector('table');
const span_nameUser = document.querySelector('.span__name_user');
const btn_back = document.querySelector('#back');


function ajustebody(type) {
    document.body.style.height = `100${type}`;
    document.body.style.width = `100${type}`;
}

function display(div, display) {
    div.style.display = display;
}

function parseData(data) {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);

    return {};
}

function preencherTable(response) {

    const res = parseData(response);
    const tags = {
        tr: {
            open: "<tr>",
            close: "</tr>"
        },
        td: {
            num_open: "<td class='num'>",
            rep_open: "<td class='nomeRepositorio'>",
            close: "</td>"
        },
        a: {
            open: "<a href='",
            closeHref: "' target='_blank'>",
            close: "</a>"
        },
        caracter: "&#8227;"
    };

    let cont = 0;
    for (rep of res) {
        cont += 1;

        span_nameUser.innerHTML = `${rep.owner.login}`

        tagTable.innerHTML += `${tags.tr.open}
                                ${tags.td.num_open}${cont}${tags.caracter}${tags.td.close}
                                    ${tags.td.rep_open}
                                        ${tags.a.open}${rep.html_url}${tags.a.closeHref}
                                        ${rep.name}${tags.a.close}
                                    ${tags.td.close}
                                ${tags.tr.close}`;


    }
}

var minhaPromise = function () {
    var input = document.querySelector('input');
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', `https://api.github.com/users/${input.value}/repos`);
        xhr.send(null);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status === 404) {
                    reject('Esse user não foi encontrado no GitHub');
                } else {
                    reject('Erro na requisição');
                }
            }
        }
    });
}


form.addEventListener("submit", event => {
    minhaPromise()
        .then(function (response) {
            display(form, 'none');
            preencherTable(response);
            ajustebody('%');
            display(table, 'flex');
        })
        .catch(function (error) {
            alert(error);
        });

    event.preventDefault()
});

btn_back.addEventListener("click", event => {
    location.reload();

    event.preventDefault()

})