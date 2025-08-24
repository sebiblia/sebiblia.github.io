

# Manual de [SeBiblia.github.io](https://SeBiblia.github.io)

La aplicación [SeBiblia.github.io](https://SeBiblia.github.io) esta diseñada para facilitar la busqueda de [codigos Strong](#codigo-strong) sobre los textos escritos en los idiomas originales de la biblia (hebreo y griego), seleccionar los versiculos que cumplen la [condición de busqueda](#condición-de-busqueda) y mostrarlos en la traducción escogida del español o inglés que prefiera el usuario.

Un ciclo normal de trabajo es:

1. Buscar en ingles o español un versículo con la [palabra](#palabra) en ingles o español. Ejemplo: [muerte](https://sebiblia.github.io/es/tool.html?biblang=%3Dmat%20%3B%20muerte&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev).
2. Abrir algun versiculo encontrado de mi interes (haciendole click al TEXTO del versiculo).
3. Identificar el código Strong para la palabra. Para la palabra 'muerte' una opcion es el codigo Strong G2288.
4. Buscar el codigo Strong. Ejemplo: [G2288](https://sebiblia.github.io/es/tool.html?biblang=G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)


## Condición de busqueda.

###  Codigo Strong

El centro de esta aplicación son los [codigos Strong](#explicación-sobre-códigos-strong) asi que simplemente escribiendo un [codigo Strong](#explicación-sobre-códigos-strong) en el campo de busqueda y dando Enter o haciendo click en "ENCUENTRA" se busca en TODA la biblia dicho codigo Strong.

Ejemplo: [G2288](https://sebiblia.github.io/es/tool.html?biblang=G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

#### Explicación sobre Códigos Strong

Los codigos Strong son esencialmente un conjunto de números que el teólogo [James Strong](https://es.wikipedia.org/wiki/James_Strong_(te%C3%B3logo)) asignó a cada raiz de vocablo hebreo o griego correspondiente a cada palabra en inglés de la traduccion al inglés de la biblia conocida como [King James Version](https://en.wikipedia.org/wiki/King_James_Version) o KJV.

Con ésta aplicación, usando los [códigos Strong](https://es.wikipedia.org/wiki/Concordancia_de_Strong), una persona que no sabe ni hebreo ni griego, puede buscar en los textos hebreos y griegos de la biblia, los versiculos con un determinado vocablo hebreo o griego, y tomar los versiculos encontrados, que ya sabe contienen el vocablo hebreo o griego, y leerlos comodamente en español o inglés en la versión LIBRE que prefiera. 

Las versiones incluyen la Reina Valera 1909 y la Sagrada Biblia Libre para el Mundo por ser versiones que NO requieren los ABSURDOS permisos de derechos de autor. El autor de la biblia es nuestro Creador y las personas que la escribieron murieron decenas de siglos antes de que se inventaran las leyes de derechos de autor en el siglo pasado.

Con ésta aplicación, única a la fecha dentro de las aplicaciones de codigo abierto y de uso gratuito, y gracias a la computación y a esta clasificación del señor James Strong, un usuario, al leer los versiculos encotrados para un código Strong, puede formarse un concepto mas claro de lo que significa el vocablo hebreo o griego correspondiente, sin necesidad de dominar el hebreo o el griego. Y si el usuario ya conoce la biblia en su idioma natal, el contexto que recuerde de cada versiculo le formara una idea aún mejor. Si el usuario es un principiante, también puede usar ésta aplicación para leer dicho contexto.

Incluso para el usuario que domina la lectura en los idiomas originales hebreo y griego es muy importante leer TODOS los versiculos que contienen el vocablo original en hebreo o griego para no quedarse con una interpretacion local de dicho vocablo. Este ejercicio cambia la perspectiva incluso para usuarios con dominio de los idiomas hebreo y griego porque da una visión global del uso del vocablo. Y esta visión es MUY importante desde el punto de vista teológico.

###  Palabra

En el campo de busqueda tambien se pueden escribir palabras que se encuentren en el idioma del texto [donde se van a buscar palabras y expresiones reculares](#interfaz-básica). Este se selecciona con el cuarto boton, y puede ser cualquiera de:

1. El texto hebreo (OT)
2. El texto griego (NT)
3. El texto en Español o Inglés (LOC)

Ejemplo: [muerte](https://sebiblia.github.io/es/tool.html?biblang=%3Dmat%20%3B%20muerte&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev).

Lo mas normal es buscar palabras en Español o Inglés luego este cuarto botón normalmente estará en la opción "LOC".

###  Versiculos

###  Operaciones binarias

En la [condición de busqueda](#interfaz-básica) también se pueden poner operaciones binarias.

1. [G2288 & G166](https://sebiblia.github.io/es/tool.html?biblang=G2288%20%26%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan ambos codigos Strong. Operacion "AND" o "y". Esta operacion tambien se puede pensar como la INTERSECCION de dos conjuntos: el de versiculos que tienen el primer código Strong con el de versiculos que tienen el segundo código Strong.

2. [G2288 | G166](https://sebiblia.github.io/es/tool.html?biblang=G2288%20%7C%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan al menos uno de los dos codigos Strong. Operacion "OR" u "o". Esta operacion tambien se puede pensar como la UNION de dos conjuntos: el de versiculos que tienen el primer código Strong con el de versiculos que tienen el segundo código Strong.

3. [G166 ! G2288](https://sebiblia.github.io/es/tool.html?biblang=G166%20!%20G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan el primero pero NO el segundo de los dos codigos Strong. Operacion "and NOT" u "y NO".

4. [G2288 ; G166](https://sebiblia.github.io/es/tool.html?biblang=G166%20%3B%20G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) es matematicamente quivalente a "G2288 | G166". Buscará los versiculos que tengan al menos uno de los dos codigos Strong. Operacion "OR" u "o". Esta operación tambien se puede pensar como una instruccion seguida de otra: busca el primer codigo Strong y a ese conjunto de versículos le añade el conjunto de versiculos que encuentre del segundo codigo Strong.

Estas operaciones se explicarán con mas detalle en la sección para usuarios avanzados, cuando se de la especificación del lenguaje de expresiones biblicas que se diseño para esta aplicación y que da una gran flexibilidad de procesamiento usando el campo de [condición de busqueda](#interfaz-básica).

###  Expresión regular

La [condición de busqueda](#interfaz-básica) también permite [expresiones regulares de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions). Este tipo de busqueda es para usuarios programadores, pero el principiante puede hacerse una idea de las posibilidades que permiten este tipo de busquedas mirando los ejemplos en el [menu principal](#interfaz-básica)

Ejemplo: [/dijo.$/](https://sebiblia.github.io/es/tool.html?biblang=%2Fdijo.%24%2F&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

###  Comando

- [.WLC](https://sebiblia.github.io/es/tool.html?biblang=.WLC&conf=O%24ALE%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en hebreo](#interfaz-básica) a West Minister Leningrad Codex (WLC).
- [.ALE](https://sebiblia.github.io/es/tool.html?biblang=.ALE&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en hebreo](#interfaz-básica) a Aleppo Codex (ALE).
- [.TKH](https://sebiblia.github.io/es/tool.html?biblang=.TKH&conf=O%24TKH%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en hebreo](#interfaz-básica) a la Tanakh (TKH).
- [.LXX](https://sebiblia.github.io/es/tool.html?biblang=.LXX&conf=O%24TKH%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el texto del campo OT, por sus siglas en Inglés (Old Testament), y mostrado en la [interfáz básica](#interfaz-básica) como "texto en hebreo" por simplicidad, al texto de la Septuaginta (LXX), que en realidad es un texto en griego.

- [.BYZ](https://sebiblia.github.io/es/tool.html?biblang=.BYZ&conf=O%24LXX%7CN%24WH%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en griego](#interfaz-básica) al texto Bizantino (BYZ).
- [.TR](https://sebiblia.github.io/es/tool.html?biblang=.TR&conf=O%24LXX%7CN%24NES%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en griego](#interfaz-básica) al texto critico conocido como Textus Receptus (TR).
- [.WH](https://sebiblia.github.io/es/tool.html?biblang=.WH&conf=O%24LXX%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en griego](#interfaz-básica) al texto critico de Wescott and Hort (WH).
- [.NES](https://sebiblia.github.io/es/tool.html?biblang=.NES&conf=O%24LXX%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en griego](#interfaz-básica) al texto critico de Nestle 1904 (NES).

- [.RVA](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=.RVA&conf=O%24WLC%7CN%24BYZ%7CL%24RVAs%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en Español o Inglés](#interfaz-básica) a la versión Resina-Valera 1909 (RVA).
- [.RVAs](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=.RVAs&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Este comando retorna cero versiculos y modifica el [texto en Español o Inglés](#interfaz-básica) a la versión Resina-Valera 1909 con códigos Strong (RVAs). Observese que estos códigos Strong NO son los que se buscan cuando se entra un código Strong en la [condición de busqueda](#interfaz-básica) porque estos códigos Strong SON los que corresponden al texto de la RVA una vez traducidos al griego y NO los del texto en griego que son los que nos interesa buscar. La mayoría corresponden, pero justamente las diferencias son las que nos interesan. Para hacer una busqueda en los códigos Strong de ésta versión Reina-Valera (una vez traducidos al griego) es necesario hacer una búsqueda de una [expresión regular](#expresión-regular) que contenga el ćódigo.
- [.KJV]
- [.KJVs]
- [.SBLM]
- [.WEB]

- [:loc]
- [:ot]
- [:nt]
- [:sco]

- [.asc]
- [.min]
- [.may]

- [.all]
- [$last]

- [.rx:i]
- [.rx:ni]

- [.dbg]
- [.nodbg]
- [.rhis]

- [=all]
- [=ot]
- [=nt]
- [=pa]
- [=ev]

- [+ot]
- [+nt]
- [+pa]
- [+ev]

- [+mat]
- [-mat]
- [+heb]
- [-heb]


## Interfaz básica.

![Interfaz inicial](https://SeBiblia.github.io/img/ui1.jpg)


## Menus de configuración

###  Antiguo testamento




