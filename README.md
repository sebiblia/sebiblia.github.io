

# Manual de [SeBiblia.github.io](https://SeBiblia.github.io)

La aplicación [SeBiblia.github.io](https://SeBiblia.github.io) permite el **ESTUDIO** de la **BIBLIA** en sus **IDIOMAS ORIGINALES** (hebreo y griego) **SIN NECESIDAD de HABLARLOS** porque esta diseñada para facilitar la **BUSQUEDA y NAVEGACION** de los textos en los idiomas ORIGINALES (hebreo y griego) pero **LEYENDO en el idioma TRADUCIDO** (Español o Inglés), usando fundamentalmente **[codigos Strong](#codigo-strong)** que con solo **HACER CLICK** y **sin memorizarlos** pueden hacer busquedas sobre los textos escritos en hebreo y griego para luego LEER los resultados de la busqueda en el idioma traducido de preferencia. 

Las condiciones de busqueda son muy flexibles y configurables. Esto se logra mediante un pequeño lenguaje computacional sobre conjuntos de versiculos que se puede **APRENDER sobre la MARCHA** siguiendo los **EJEMPLOS** de busqueda. Y la navegación se logra con varios **menus desplegables** que se activan haciendo click sobre los textos de respuesta y que abren diferentes opciones de busquedas automaticas con solo hacer un click.

## Interfaz básica.

![Interfaz inicial](https://SeBiblia.github.io/img/ui1.jpg)

## Condición de busqueda.

La condicion de busqueda es en realidad un pequeño lenguaje computacional sobre conjuntos de versiculos pero los criterios básicos de seleccion de conjuntos de versiculos son los siguientes:

###  Codigo Strong

El centro de esta aplicación son los [codigos Strong](#explicación-sobre-códigos-strong) asi que simplemente escribiendo un [codigo Strong](#explicación-sobre-códigos-strong) en el campo de busqueda y dando Enter o haciendo click en ENCUENTRA se busca en TODA la biblia dicho codigo Strong.

Ejemplo: [G2288](https://sebiblia.github.io/es/tool.html?biblang=G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

Los codigos Strong SIEMPRE se buscan en TODA la biblia. Si son codigos griegos se buscan en el texto del Nuevo Testamento seleccionado en el campo NT o en la LXX si esta ha sido seleccionada en el campo OT. Y si son codigos Strong hebreos se buscan en el Antiguo Textamento seleccionado en el campo OT, con excepcion de la LXX puesto que esta escrita en griego.

#### Explicación sobre Códigos Strong

Los codigos Strong son esencialmente un conjunto de números que el teólogo [James Strong](https://es.wikipedia.org/wiki/James_Strong_(te%C3%B3logo)) asignó a cada raiz de vocablo hebreo o griego correspondiente a cada palabra en inglés de la traduccion al inglés de la biblia conocida como [King James Version](https://en.wikipedia.org/wiki/King_James_Version) o KJV.

Con ésta aplicación de estudio profundo de la biblia, usando los [códigos Strong](https://es.wikipedia.org/wiki/Concordancia_de_Strong), una persona que no sabe ni hebreo ni griego, puede buscar en los textos hebreos y griegos de la biblia de los manuscritos y textos criticos mas importantes, los versiculos con un determinado vocablo hebreo o griego, y tomar los versiculos encontrados, que ya sabe contienen el vocablo hebreo o griego, y leerlos comodamente en español o inglés en la traduccion de preferencia. 

Las versiones de texto traducido incluyen la Reina Valera 1909 (RVA) y la Sagrada Biblia Libre para el Mundo (SBLM) por ser versiones que NO requieren permisos de derechos de autor y esta aplicación es para el estudio gratuito de la biblia en general, no solo de 500 versiculos.

Con ésta aplicación de estudio profundo de la biblia, única a la fecha dentro de las aplicaciones de codigo abierto y de uso gratuito, y gracias a la computación y a esta clasificación del señor James Strong, un usuario, al leer en un idioma traducido los versiculos encotrados para un código Strong en los textos escritos en los idiomas originales, puede formarse un concepto mas claro de lo que significa el vocablo hebreo o griego correspondiente, sin necesidad de dominar el hebreo o el griego. 

Es especialmente recomendada para personas que ya han leido la biblia en su totalidad y que tiene elgún conocimiento de las referencias cruzadas que tiene la biblia, así el usuario podrá usar el contexto que recuerde de cada versiculo en el resultado, y formarse una idea aún mejor del significado original del vocablo hebreo o griego, pero también es útil para el usuario principiante justamente porque, sin necesidad de hablar los idiomas originales, puede navegar e irse formando una idea de la multitud de interrelaciones que tiene la biblia. Navegandola en sus idiomas originales, de las multiples maneras que permite esta aplicación, pero leyendo comodamente en un idioma traducido.

Incluso el lector de los idiomas originales se verá beneficiado de este tipo de ejercicio hermeneutico, ya que normalmente se sigue la linea aprendida en la academia donde se aprendieron los idiomas originales. Este ejercicio cambia la perspectiva incluso para usuarios con dominio de los idiomas hebreo y griego porque une en un mismo ejercicio la visión global de un vocablo con la visión particular del vocable en un versiculo y el resultado puede no ser el que se tenia en mente. Este ejercicio hermeneutico es una buena base para una teología CONSISTENTE y COMPLETA, especialmente en las areas de la soteriología y la escatología, areas MUY afectadas por pequeños detalles en las interpretaciones y traducciones mas polulares en la academia. Al hacer este ejercicio se hace evidente la INCONSISTENCIA. 

###  Palabra

En el campo de busqueda tambien se pueden escribir palabras que se encuentren en el idioma del texto [donde se van a buscar palabras y expresiones reculares](#interfaz-básica). Este se selecciona con el cuarto boton, y puede ser cualquiera de:

1. El texto traducido. Español o Inglés. (LOC)
2. El texto hebreo (OT)
3. El texto griego (NT)

Ejemplo: [muerte](https://sebiblia.github.io/es/tool.html?biblang=%3Dmat%20%3B%20muerte&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev).

Lo mas normal es buscar palabras en el texto traducido, ya sea Español o Inglés, puesto que se asume que el usuario no habla los idiomas originales, pero la aplicación también permite hacer busquedas de TEXTO (no solo codigos Strong) sobre los textos en los idiomas originales. Para pode hacer este tipo de busquedas facilmente usa una tabla de [trans-deletreo](#trans-deletreo) y poder escribir la palabra hebrea o griega (o parte de ellas) con letras del idioma traducido ([caracteres ASCII](https://es.wikipedia.org/wiki/ASCII)).

###  Citas bíblicas

En el campo de busqueda tambien se pueden escribir versículos usando nombres en Inglés, Español o abreviaturas en inglés. Los nombres pueden ir con o sin tildes. También pueden ir en mayusculas o en minusculas o mixto.

#### Inglés: 

genesis, exodus, leviticus,	numbers, deuteronomy, joshua, judges, ruth, 1_samuel, 2_samuel, 1_kings, 2_kings, 1_chronicles, 2_chronicles, ezra, nehemiah, esther, job, psalms, proverbs, ecclesiastes, songs, isaiah, jeremiah, lamentations, ezekiel, daniel, hosea, joel, amos, obadiah,
jonah, micah, nahum, habakkuk, zephaniah, haggai, zechariah, malachi, matthew, mark, luke, john, acts, romans, 1_corinthians, 2_corinthians, galatians, ephesians, philippians, colossians, 1_thessalonians, 2_thessalonians, 1_timothy, 2_timothy, titus, philemon, hebrews, james, 1_peter, 2_peter, 1_john, 2_john, 3_john, jude, revelation,

#### Español:

génesis, éxodo, levítico, números, deuteronomio, josué, jueces, rut, 1_samuel, 2_samuel, 1_reyes, 2_reyes, 1_crónicas, 2_crónicas, esdras, nehemías, ester, job, salmos, proverbios, eclesiastés, cantares, isaías, jeremías, lamentaciones, ezequiel, daniel, oseas, joel, amós, abdías, jonás, miqueas, nahúm, habacuc, sofonías, hageo, zacarías, malaquías, mateo, marcos, lucas, juan, hechos, romanos, 1_corintios, 2_corintios, gálatas, efesios, filipenses, colosenses, 1_tesalonicenses, 2_tesalonicenses, 1_timoteo, 2_timoteo, tito, filemón, hebreos, santiago, 1_pedro, 2_pedro, 1_juan, 2_juan, 3_juan, judas, apocalipsis,

#### Abreviaturas en Inglés:

gen, exo, lev, num, deu, jos, jdg, rth, 1sa, 2sa, 1ki, 2ki, 1ch, 2ch, ezr, neh, est, job, psa, pro, ecc, sng, isa, jer, lam, eze, dan, hos, joe, amo, oba, jon, mic, nah, hab, zep, hag, zec, mal, mat, mar, luk, jhn, act, rom, 1co, 2co, gal, eph, phl, col, 1th, 2th, 1ti, 2ti, tit, phm, heb, jas, 1pe, 2pe, 1jo, 2jo, 3jo, jde, rev,

Los nombres completos con mas de tres letras, NO las abreviaturas, pueden tener hasta 2 letras mal y la aplicación aproximara al nombre mas cercano.

Las citas NO pueden tener espacios. Deben ir SIN espacios. Con uno de los siguientes formatos:

- nombre_libro.capítulo

Ejemplo: [1_Tesalonisenses.1](https://sebiblia.github.io/es/tool.html?biblang=1_Tesalonisenses.1&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- nombre_libro-capítulo

Ejemplo: [2CoRintios-1](https://sebiblia.github.io/es/tool.html?biblang=2CoRintios-1&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- nombre_libro.capítulo:versiculo

Ejemplo: [MAT.1:5](https://sebiblia.github.io/es/tool.html?biblang=MAT.1%3A5&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- nombre_libro.capítulo:versiculo_inicio-versiculo_final

Ejemplo: [marteo.1:5-9](https://sebiblia.github.io/es/tool.html?biblang=marteo.1%3A5-9&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)


###  Operaciones binarias

En la [condición de busqueda](#interfaz-básica) también se pueden poner operaciones binarias.

1. [G2288 & G166](https://sebiblia.github.io/es/tool.html?biblang=G2288%20%26%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan ambos codigos Strong. Operacion AND o y. Esta operacion tambien se puede pensar como la INTERSECCION de dos conjuntos: el de versiculos que tienen el primer código Strong con el de versiculos que tienen el segundo código Strong.

2. [G2288 | G166](https://sebiblia.github.io/es/tool.html?biblang=G2288%20%7C%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan al menos uno de los dos codigos Strong. Operacion OR u o. Esta operacion tambien se puede pensar como la UNION de dos conjuntos: el de versiculos que tienen el primer código Strong con el de versiculos que tienen el segundo código Strong.

3. [G166 ! G2288](https://sebiblia.github.io/es/tool.html?biblang=G166%20!%20G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) buscará los versiculos que tengan el primero pero NO el segundo de los dos codigos Strong. Operacion and NOT u y NO.

4. [G2288 ; G166](https://sebiblia.github.io/es/tool.html?biblang=G166%20%3B%20G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) es matematicamente quivalente a G2288 | G166. Buscará los versiculos que tengan al menos uno de los dos codigos Strong. Operacion OR u o. Esta operación tambien se puede pensar como una instruccion seguida de otra: busca el primer codigo Strong y a ese conjunto de versículos le añade el conjunto de versiculos que encuentre del segundo codigo Strong.

Estas operaciones se explicarán con mas detalle en la sección para usuarios avanzados, cuando se de la especificación del lenguaje de expresiones biblicas que se diseño para esta aplicación y que da una gran flexibilidad de procesamiento usando el campo de [condición de busqueda](#interfaz-básica).

###  Expresión regular

La [condición de busqueda](#interfaz-básica) también permite [expresiones regulares de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions). Este tipo de busqueda es para usuarios programadores, pero el principiante puede hacerse una idea de las posibilidades que permiten este tipo de busquedas mirando los ejemplos en el [menu principal](#interfaz-básica)

Ejemplo: [/dijo.$/](https://sebiblia.github.io/es/tool.html?biblang=%2Fdijo.%24%2F&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

###  Comando

Los comandos retornan CERO (0) versiculos, así que cuando se usan dentro de una formula binaria el resultado de CUALES versiculos retorna la operacion depende de los siguientes parametros en la operación binaria en que ese encuentren estos comandos. Sin embargo SI afectan el resultado porque alteran la configuración, es decir en donde, en que texto, los siguientes parametros van a realizar la busqueda o la forma de presentar los resultados.

####  Códigos hebreos (OT)

Estos comandos cambian la configuración para que los códigos Strong HEBREOS se busquen en el respectivo texto critico del Antiguo Testamento.

Los siguientes comandos son equivalentes a modificar [el campo OT](#menu-o-campo-ot), por sus siglas en Inglés de: Old Testament, y que en el [gráfico](#interfaz-básica) se denominó [códigos hebreos](#interfaz-básica) para que sea mas comprensible para el principiante o la persona que no habla Inglés. La excepción es la Septuaginta (LXX) puesto que fue escrita en griego. Y por supuesto las busquedas de códigos Strong en LXX deben ser códigos Strong del griego.

- [.WLC](https://sebiblia.github.io/es/tool.html?biblang=.WLC&conf=O%24ALE%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en West Minister Leningrad Codex (WLC).
- [.ALE](https://sebiblia.github.io/es/tool.html?biblang=.ALE&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en Aleppo Codex (ALE).
- [.TKH](https://sebiblia.github.io/es/tool.html?biblang=.TKH&conf=O%24TKH%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en la Tanakh (TKH).
- [.LXX](https://sebiblia.github.io/es/tool.html?biblang=.LXX&conf=O%24TKH%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong GRIEGOS en la Septuaginta (LXX).

Ejemplo: [(.WLC ; H1) ! (.ALE ; H1)](https://sebiblia.github.io/es/tool.html?biblang=(.WLC%20%3B%20H1)%20!%20(.ALE%20%3B%20H1)&conf=O%24ALE%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Busca los versiculos que en la WLC tienen el código H1 pero en la ALE NO tienen dicho código.


#### Códigos griegos (NT)

Estos comandos cambian la configuración para que los códigos Strong GRIEGOS se busquen en el respectivo texto critico del Nuevo Testamento.

Son equivalentes a modificar [el campo NT](#menu-o-campo-nt), por sus siglas en Inglés de: New Testament, y que en el [gráfico](#interfaz-básica) se denominó [Códigos griegos](#interfaz-básica) para que sea mas comprensible para el principiante o la persona que no habla Inglés.

- [.BYZ](https://sebiblia.github.io/es/tool.html?biblang=.BYZ&conf=O%24LXX%7CN%24WH%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en el texto Bizantino (BYZ).
- [.TR](https://sebiblia.github.io/es/tool.html?biblang=.TR&conf=O%24LXX%7CN%24NES%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en el Textus Receptus (TR).
- [.WH](https://sebiblia.github.io/es/tool.html?biblang=.WH&conf=O%24LXX%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en el texto critico de Wescott and Hort (WH).
- [.NES](https://sebiblia.github.io/es/tool.html?biblang=.NES&conf=O%24LXX%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que se busquen códigos Strong en el texto critico de Nestle 1904 (NES).

#### Texto traducido (LOC)

Estos comandos cambian la configuración para determinar que versión de biblia TRADUCIDA se usará en la busqueda. Por defecto se usa para mostrar los versiculos resultado en la versión escogida y hacer busquedas de [Texto](#palabra) y [Expresiones Regulares](#expresión-regular) en la versión escogida, pero esto se puede modificar con [comandos o el campo RX](#dónde-busca-palabras-y-expresiones-regulares-rx).

Son equivalentes a modificar [el campo LOC](#menu-o-campo-loc), por referirse a un texto local, y que en el [gráfico](#interfaz-básica) se denominó [Texto traducido](#interfaz-básica) para que sea mas comprensible.


- [.RVA](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=.RVA&conf=O%24WLC%7CN%24BYZ%7CL%24RVAs%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión Reina-Valera 1909 (RVA).
- [.RVAs](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=.RVAs&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión Reina-Valera 1909 con códigos Strong (RVAs). Observese que estos códigos Strong NO son los que se buscan cuando se entra un código Strong en la [condición de busqueda](#interfaz-básica) porque estos códigos Strong son los que se clasificaron en la TRADUCCION de la RVA (y que corresponden al idioma original) y NO los del texto en el idioma original, que son los que nos interesa buscar. La mayoría corresponden, pero no siempre es el caso. Justamente el objetivo es poder identificar lo que dice el texto en su idioma original. Para hacer una busqueda de los códigos Strong clasificados en la RVAs es necesario hacer una búsqueda de una [expresión regular](#expresión-regular) que contenga el ćódigo.
- [.KJV](https://sebiblia.github.io/es/tool.html?biblang=.KJV&conf=O%24ALE%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión King James Version (KJV).
- [.KJVs](https://sebiblia.github.io/es/tool.html?biblang=.KJVs&conf=O%24ALE%7CN%24BYZ%7CL%24KJV%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión King James Version con códigos Strong (KJVs). Observese que estos códigos Strong NO son los que se buscan cuando se entra un código Strong en la [condición de busqueda](#interfaz-básica) porque estos códigos Strong son los que se clasificaron en la TRADUCCION de la KJV (una vez traducidos al idioma original) y NO los del texto en el idioma original, que son los que nos interesa buscar. La mayoría corresponden, pero no siempre es el caso. Justamente el objetivo es poder identificar lo que dice el texto en su idioma original. Para hacer una busqueda de los códigos Strong clasificados en la KJVs es necesario hacer una búsqueda de una [expresión regular](#expresión-regular) que contenga el ćódigo.
- [.SBLM](https://sebiblia.github.io/es/tool.html?biblang=.SBLM&conf=O%24ALE%7CN%24BYZ%7CL%24KJVs%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión Sagrada Biblia Libre para el Mundo (SBLM).
- [.WEB](https://sebiblia.github.io/es/tool.html?biblang=.WEB&conf=O%24ALE%7CN%24BYZ%7CL%24SBLM%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los versículos que se muestran del resultado sean de la versión World English Bible (WEB).

#### Dónde busca palabras y expresiones regulares (RX)

Estos comandos cambian la configuración para determinar DONDE se buscan palabras y expresiones regulares. 

Son equivalentes a modificar [el campo RX](#menu-o-campo-rx), una abreviatura de Regular eXpresion, que se refiere a expresiones regulares, y que en el [gráfico](#interfaz-básica) se denominó [texto traducido](#interfaz-básica) para que sea mas comprensible para el principiante.

Es importante anotar que los versiculos encontrados SIEMPRE se muestran en el idioma del campo (RX), el modificado por estos comandos. Es por eso que NORMALMENTE el campo RX está en LOC (en idioma traducido). Pero si se quiere ver el texto en el idioma original se puede cambiar justamente este campo (RX), ya sea usando estos comandos o con el menu en la [interfaza grafica](#interfaz-básica).

- [:loc](https://sebiblia.github.io/es/tool.html?biblang=%3Aloc&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24asc%7Ci%24nt%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que las palabras y las expresiones regulares se busquen en el texto critico seleccionado en el campo LOC.
- [:ot](https://sebiblia.github.io/es/tool.html?biblang=%3Aot&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que las palabras y las expresiones regulares se busquen en el texto critico seleccionado en el campo OT. Las palabras y expresiones regulares se escriben en ASCCI siguiendo el [trans-deletreo](#trans-deletreo) del Unicode griego a ASCCI dado por la tabla de [trans-deletreo](#trans-deletreo)
- [:nt](https://sebiblia.github.io/es/tool.html?biblang=%3Ant&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que las palabras y las expresiones regulares se busquen en el texto critico seleccionado en el campo NT. Las palabras y expresiones regulares se escriben en ASCCI siguiendo el [trans-deletreo](#trans-deletreo) del Unicode griego a ASCCI dado por la tabla de [trans-deletreo](#trans-deletreo)
- :sco . Reservado. Sin implementar.

#### Presentación de versiculos resultado (P)

Estos comandos establecen en que tipo de caracteres se escriben los versiculos. Sirven mas que todo cuando los versiculos resultado se estan mostrando de los textos en los idiomas ORIGINALES. Es decir cuando el campo RX tiene valor OT o valor NT.

Estos comandos solo son ejecutables desde el campo de busqueda. No hay interfaz visible de usuario para ejecutar estos comandos.

Deberian escribirse una sola vez en la formula puesto que solo afecta la presentacion el ultimo ejecutado.

- [.asc](https://sebiblia.github.io/es/tool.html?biblang=.asc&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24min%7Ci%24ot%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los resultados se muestren en letras del idioma traducido, [caracteres ASCII](https://es.wikipedia.org/wiki/ASCII). Si el campo RX esta en OT o NT usara las tablas de [trans-deletreo](#trans-deletreo).
- [.min](https://sebiblia.github.io/es/tool.html?biblang=.min&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24asc%7Ci%24ot%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los resultados se muestren en letras minusculas. Solo afecta la presentacion cuando el campo RX esta en OT o NT (resultados tomados de los textos en los idiomas originales).
- [.may](https://sebiblia.github.io/es/tool.html?biblang=.may&conf=O%24ALE%7CN%24BYZ%7CL%24WEB%7Co%24asc%7Ci%24ot%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Cambia la configuración para que los resultados se muestren en letras mayusculas. Solo afecta la presentacion cuando el campo RX esta en OT o NT (resultados tomados de los textos en los idiomas originales).

Ejemplos:

- [.may ; H125](https://sebiblia.github.io/es/tool.html?biblang=.may%20%3B%20H125&conf=O%24WLC%7CN%24BYZ%7CL%24WEB%7Co%24may%7Ci%24ot%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Muestra los resultados en letras hebreas.

- [.asc ; H125](https://sebiblia.github.io/es/tool.html?biblang=.asc%20%3B%20H125&conf=O%24WLC%7CN%24BYZ%7CL%24WEB%7Co%24may%7Ci%24ot%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Muestra los resultados en letras ASCII.

- [.min ; G166](https://sebiblia.github.io/es/tool.html?biblang=.min%20%3B%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24WEB%7Co%24min%7Ci%24nt%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Muestra los resultados en letras minusculas griegas.

- [.may ; G166](https://sebiblia.github.io/es/tool.html?biblang=.may%20%3B%20G166&conf=O%24WLC%7CN%24BYZ%7CL%24WEB%7Co%24min%7Ci%24nt%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev) Muestra los resultados en letras mayusculas griegas.

Observe que TODOS los campos afectan el resultado. 

#### Intervalos de busqueda

Sirven para determinar en que libros de la biblia se van a hacer busquedas de [Texto](#palabra) y de [Expresiones Regulares](#expresión-regular).  Asi, estos comandos deben usarse en conjunto con busquedas de [Texto](#palabra) o de [Expresiones Regulares](#expresión-regular).

Estos comandos NO pueden llevar espacios entre los simbolos (=, +, -) y las letras.

Estos comandos pueden ir en mayusculas o minusculas.

Estos comandos NO afectan la busqueda de [códigos Strong](#codigo-strong). Los codigos Strong SIEMPRE se buscan en TODA la biblia. Si son codigos griegos se buscan en el texto del Nuevo Testamento seleccionado en el campo NT o en la LXX si esta ha sido seleccionada en el campo OT. Y si son codigos Strong hebreos se buscan en el Antiguo Textamento seleccionado en el campo OT, con excepcion de la LXX puesto que esta escrita en griego.

Estos comandos SOLO afectan la busqueda de [Texto](#palabra) y de [Expresiones Regulares](#expresión-regular).

Estos comandos solo son ejecutables desde el campo de busqueda. No hay interfaz visible de usuario para ejecutar estos comandos. 

Estos comandos tienen el siguiente formato: SimboloPalabra

El formato NO lleva espacios. Simbolo va pegado a Palabra.

Donde Simbolo es uno de tres: = + -

Y Palabra es uno de los siguientes:

1. all
2. ot
3. nt
4. pa
5. ev
6. cualquier [abreviatura de libro](#abreviaturas-en-inglés)

Ejemplos de escritura:

- =all Fija el rango de busqueda a todos los posibles.
- =ot Fija el rango de busqueda a los libros del Antiguo Testamento.
- =nt Fija el rango de busqueda a los libros del Nuevo Testamento.
- =pa Fija el rango de busqueda a los libros de Pablo.
- =ev Fija el rango de busqueda a los libros de los evangelios.

- +ot Añade al rango de busqueda los libros del Antiguo Testamento.
- +nt Añade al rango de busqueda los libros del Nuevo Testamento.
- +pa Añade al rango de busqueda los libros de Pablo.
- +ev Añade al rango de busqueda los libros de los evangelios.

- +mat Añade al rango de busqueda el libro de Mateo.
- -mat Quita al rango de busqueda el libro de Mateo.
- +heb Añade al rango de busqueda el libro de Hebreos.
- -heb Quita al rango de busqueda el libro de Hebreos.

Ejemplos de uso:

- [=ev ; infier](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=%3Dev%20%3B%20infier&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- [=pa ; fuego](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=%3Dpa%20%3B%20fuego&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- [=nt ; -mat ; infier](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=%3Dnt%20%3B%20-mat%20%3B%20infier&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- [=nt ; -mat ; -rev;  -luk ; -act ;  infier](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=%3Dnt%20%3B%20-mat%20%3B%20-rev%3B%20%20-luk%20%3B%20-act%20%3B%20%20infier&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

- [=mat ; +rev; +luk ; infier](http://localhost/JOSE/sebiblia.github.io/es/tool.html?biblang=%3Dmat%20%3B%20%2Brev%3B%20%2Bluk%20%3B%20infier&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

#### Otros comandos

- [.all] Fija todos los parametros de configuracion para trabajar con TODA la biblia. Este comando se ejecuta por defecto al comienzo de TODA busqueda. 
- [$last] Retorna los versiculos de la ULTIMA busqueda.

- [.rx:i] Cambia la configuracion para que las busquedas de [Texto](#palabra) o de [Expresiones Regulares](#expresión-regular) sean INSENSITIVAS a mayusculas, minusculas, o TILDES. Este comando se ejecuta por defecto al comienzo de TODA busqueda.
- [.rx:ni] Cambia la configuracion para que las busquedas de [Texto](#palabra) o de [Expresiones Regulares](#expresión-regular) NO sean insensitivas a mayusculas, minusculas, o TILDES. Es decir que las busquedas se vuelven SENSITIVAS a mayusculas, minusculas, o TILDES.

- [.dbg] Cambia la configuracion para empezar a guardar información de depurado. Permite saber como se ejecutó, cuales fueron los pasos, durante la ejecucion de una busqueda. Si desde el [menu principal](#interfaz-básica) se tiene abierto el campo de DEPURADO, este comando se ejecuta antes de la busqueda y al final de la busqueda toda la informacion de depurado se muestra en dicho campo de DEPURADO.
- [.nodbg] Cambia la configuracion para dejar de guardar información de depurado. 
- [.rhis] RESETEA la historia de busquedas. Borra toda la informacion de busquedas anteriores.


## Menus o campos de configuración

Se muestran en la [interfaz básica](#interfaz-básica) encima del campo de busqueda.

### Menu o campo OT

Permite seleccionar sobre que texto del Antiguo Testamento se van hacer las busquedas de [códigos Strong](#codigo-strong) hebreos. La excepciones la Septuaginta (LXX) por estar escrita en griego y porlo tanto se buscan [códigos Strong](#codigo-strong) griegos. Es equivalente a ejecutar un [comando de campo OT](#códigos-hebreos-ot) antes de la busqueda.

### Menu o campo NT

Permite seleccionar sobre que texto del Nuevo Testamento se van hacer las busquedas de [códigos Strong](#codigo-strong) griegos. Es equivalente a ejecutar un [comando de campo NT](#códigos-griegos-nt) antes de la busqueda.

### Menu o campo LOC

Permite seleccionar sobre que texto TRADUCIDO se va a usar en las busquedas. Es equivalente a ejecutar un [comando de campo LOC](#texto-traducido-loc) antes de la busqueda.

### Menu o campo RX

Permite seleccionar sobre que texto (OT, NT o LOC) se van hacer las busquedas de [Texto](#palabra) o de [Expresiones Regulares](#expresión-regular). Los versiculos resultado se muestran en el texto seleccionado, a menos que haya [comandos](#dónde-busca-palabras-y-expresiones-regulares-rx) que modifiquen dicho comportamiento. Es equivalente a ejecutar un [comando de campo RX](#dónde-busca-palabras-y-expresiones-regulares-rx) antes de la busqueda.

### Menu o campo D

Permite seleccionar el Diccionario de TRADUCCION que se va a usar en el analisis textual de un versiculo. 

Cada opcion de Diccionario tiene un color distintivo que se corresponde con el color en que se muestran la TRADUCCION en los analisis textuales de versiculos.

Estan las siguientes opciones, 

1. uRVA. Unificada de la RVAs. Es un diccionario extraido de la Reina-Valera con códigos Strong. En este diccionario se seleccionó una UNICA TRADUCCION para cada pareja de (codigo Strong, deletreo-ASCCI del vocablo). Primero se selecciono la de mayor ocurrencia y si había empates, una o mas TRADUCCION con el mismo numero de ocurrencias, se selecciono la TRADUCCION mas corta.

2. uKJV. Unificada de la KJVs. Es un diccionario extraido de la King James Version con códigos Strong. En este diccionario se seleccionó una UNICA TRADUCCION para cada pareja de (codigo Strong, deletreo-ASCCI del vocablo). Primero se selecciono la de mayor ocurrencia y si había empates, una o mas TRADUCCION con el mismo numero de ocurrencias, se selecciono la TRADUCCION mas corta.

3. Ben. BibleHub English. Es un diccionario extraido de los analisis textuales de biblehub.com.

4. B2es Biblehub Español. Es una traduccion de Ben usando Google translate.

5. Sen. English Strong code definitions. Es un diccionario extraido de las definiciones en Inglés de los códigos Strong. Por lo tanto si un codigo Strong tiene diferentes deletreos ya sea por conjugaciones o prefijos que modifican la raiz. Este diccionario solo muestra una UNICA definicion para cada codigo Strong.

6. Ses. Definiciones de codigos Strong. Es un diccionario extraido de las definiciones en Español de los códigos Strong. Por lo tanto si un codigo Strong tiene diferentes deletreos ya sea por conjugaciones o prefijos que modifican la raiz. Este diccionario solo muestra una UNICA definicion para cada codigo Strong.

7. SBIB. Esta opcions solo esta disponible para las versiones KJVs y RVAs. Es decir cuando el campo LOC tiene uno de estos dos valores. Es simplemente la correspondencia uno a uno de cada codigo Strong que ESTA en el analisis textual, con su aparicion, si TAMBIEN ESTA, en el versiculo correspondiente de la RVAs o la KJVs.

### Trans-deletreo

```
HEBREW

ALEF    -> e 
BET     -> b 
GIMEL   -> g 
DALET   -> d 
HE      -> h 
VAV     -> v 
ZAYIN   -> x 
HET     -> k 
TET     -> p 
YOD     -> i 
F_KAF   -> c 
KAF     -> c 
LAMED   -> l 
F_MEM   -> m 
MEM     -> m 
F_NUN   -> n 
NUN     -> n 
SAMEKH  -> s 
AYIN    -> a 
F_PE    -> f 
PE      -> f 
F_TSADI -> z 
TSADI   -> z 
KUF     -> q 
RESH    -> r 
SHIN    -> w 
TAV     -> t 

GREEK

α -> a 
β -> b 
γ -> g 
δ -> d 
ε -> e 
ϝ -> F 
ͷ -> N 
ϛ -> S 
ζ -> z 
ͱ -> H 
η -> h 
θ -> q 
ι -> i 
ϳ -> j 
κ -> k 
λ -> l 
μ -> m 
ν -> n 
ξ -> x 
ο -> o 
π -> p 
ϻ -> M 
ϟ -> K 
ϙ -> Q 
ρ -> r 
ς -> s 
σ -> s 
ͼ -> Z 
τ -> t 
υ -> u 
φ -> f 
χ -> c 
ψ -> y 
ω -> w 
```

## Ciclo corto

Un ciclo corto normal de trabajo es:

1. Buscar en ingles o español un versículo con la [palabra](#palabra) en ingles o español. Ejemplo: [muerte](https://sebiblia.github.io/es/tool.html?biblang=%3Dmat%20%3B%20muerte&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev).
2. Abrir algun versiculo encontrado de mi interes (haciendole click al TEXTO del versiculo).
3. Identificar el código Strong para la palabra. Para la palabra 'muerte' una opcion es el codigo Strong G2288.
4. Buscar el codigo Strong. Ejemplo: [G2288](https://sebiblia.github.io/es/tool.html?biblang=G2288&conf=O%24WLC%7CN%24BYZ%7CL%24RVA%7Co%24asc%7Ci%24loc%7Cs%24sco%3Aall%2Brx%3Aall%2Bwd%3Aall%2Bhis%3A1000%2Bdbg%3A1000%7Cr%24true%7CI%24gen%3Arev)

## Ciclo mas complejos

Ver los videos [subidos a YouTube](https://www.youtube.com/watch?v=ULr0gb-iHlI&list=PLB1e7xsVodJX0xQcz36gQybgPpjjQL-ED) en el canal de JoseLuisQuirogaBeltran en la lista SeBiblia.github.io

OBSERVACION: Algunos videos estan con la vieja interfaz que tenia un boton adicional para alterar la presentación. Se simplificó la interfaz para el caso normal en que se hacen busquedas sobre OT o NT. La funcionalidad se mantiene de dos maneras. COn un boton adicional por versiculo, si se esta buscando sobre OT o NT palabras o expresiones regulares. Y por supuesto con [los comandos para modificacion de la presentacion](#presentación-de-versiculos-resultado-p).



