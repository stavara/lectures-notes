document.addEventListener('DOMContentLoaded', () => {
    const links = Array.from(document.querySelectorAll('#menu a'));
    const sections = {
        writing: document.getElementById('post'),
        about:   document.getElementById('about'),
        lecture: document.getElementById('lecture')
    };
    const writingMd = document.getElementById('writing-md');

    function showSection(name, updateHash = true) {
        // Mostrar u ocultar las secciones principales
        Object.entries(sections).forEach(([key, el]) => {
            if (!el) return;
            el.style.display = (key === name) ? 'block' : 'none';
        });

        // Lógica adicional para writing-md
        if (name === 'writing') {
            document.getElementById('post').style.display = 'block';
            if (writingMd) writingMd.style.display = 'none';
        } else {
            if (writingMd) writingMd.style.display = 'none';
        }

        // Activar el enlace activo
        links.forEach(a => {
            const txt = a.textContent.trim().toLowerCase();
            const isActive =
                (name === 'writing' && txt.includes('writing')) ||
                (name === 'about'   && txt.includes('about'))   ||
                (name === 'lecture' && txt.includes('lecture'));
            a.classList.toggle('active', isActive);
            if (isActive) {
                a.setAttribute('aria-current', 'page');
            } else {
                a.removeAttribute('aria-current');
            }
        });

        if (updateHash) {
            history.replaceState(null, '', `#${name}`);
        }
    }

    // Manejadores de click en el menú
    links.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const txt = a.textContent.trim().toLowerCase();
            if (txt.includes('about')) {
                showSection('about');
            } else if (txt.includes('lecture')) {
                showSection('lecture');
            } else {
                showSection('writing');
            }
        });
    });

    // Al cargar la página
    const hash = location.hash.slice(1).toLowerCase();
    if (hash === 'about' || hash === 'writing' || hash === 'lecture') {
        showSection(hash, false);
    } else {
        showSection('lecture', false);
    }

    // Manejadores de click en los posts
    document.querySelectorAll('#post a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const texto = this.textContent.trim();
            const slug = texto.toLowerCase().replace(/\s+/g, '-');
            const archivo = `writing/${slug}.txt`;

            fetch(archivo)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`No se pudo cargar el archivo: ${archivo}`);
                    }
                    return response.text();
                })
                .then(textoArchivo => {
                    // Oculta la lista de posts y muestra el contenido
                    document.getElementById('post').style.display = 'none';
                    writingMd.style.display = 'block';
                    writingMd.textContent = textoArchivo;
                })
                .catch(error => {
                    console.error(error.message);
                    writingMd.style.display = 'block';
                    writingMd.textContent = 'Error al cargar el archivo.';
                });
        });
    });
});
