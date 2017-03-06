Mutable CSS
=====

**Estándar para estructura CSS a través de <u>Regiones</u>, <u>Componentes</u>, <u>Elementos</u> y <u>Mutables</u>.**


### TL;DR

- Define **regiones**, zonas reutilizables que compondrán tu layout: `section, nav, aside, article, main, header, footer` y decláralas con ID's semánticos en el HTML. 
- Crea **componentes** modulares y nómbralos con 2 palabras separadas por un guión (`-`): `.screenshot-image`.
- Components contienen **elementos**, nómbralos con 1 palabra: `.title`.
- Componentes y elementos tienen **mutables**, variaciones que se declaran un guión (`-`) como prefijo y de 2 tipos: variaciones de *diseño*: `-large`, `-small` de *estado*: `-disabled`, `-active`.
- Componentes y elementos pueden ser heredados y no deben tener propiedades de posicionamiento y tamaño; defíneselos en su contexto y apóyate de las regiones.


Regiones
---------------

Todo layout se compone de regiones globales, las cuales se definen según el [seccionamiento de HTML5](http://blog.teamtreehouse.com/use-html5-sectioning-elements). Estas regiones se identificarán a través del atributo `id=""` conformadas de una sola palabra, lo que permitirá tener mejor semántica y mejor acceso desde marcas de analítica. Evita apoyarte de estos `ID's` para definir estilos, puede ser dañino al ser mal utilizado (en la duda, mejor evitar).

![Regiones](https://raw.githubusercontent.com/I2BTech/MutableCSS/master/images/regiones.png)

Ejemplos de regiones comúnes se listan a continuación:

- `#header`
- `#content`
- `#sidebar`
- `#footer`


Componentes
---------------

Cada pieza de la interfaz corresponde a un *componente* individual. Componentes serán nombrados con **por lo menos 2 palabras** en inglés y separadas con un guión (`-`), por ejemplo:

* Un menú (`.menu-header`)
* Un formulario de búsqueda (`.form-search`)
* Una caja de perfil de usuario (`.box-user-profile`)

![Componente](https://raw.githubusercontent.com/I2BTech/MutableCSS/master/images/componente.png)

Nótese que el componente comienza con el tipo de componente (**menu, form, box**) y la siguiente palabra es el contexto ó ubicación única en una región ó función (**header, search, user profile**). Esto es para poder identificar rápida y fácilmente otros tipos de componentes similares, porque como sabemos existirán varios `.menu-` y muchos `.box-` entre otros.

#### Componentes anidados

![Componentes Anidados](https://raw.githubusercontent.com/I2BTech/MutableCSS/master/images/componente-anidado.png)

Se permite anidar componentes si se requiere:

```html
<div class='box-article'>
	<div class='box-vote'>
  		...
	</div>
	<h3 class='title'>...</h3>
	<p class='meta'>...</p>
</div>
```

Elementos
---------------

Cada componente contiene uno o más elementos. Los nombres de clases para elementos **tienen sólo una palabra**:

```scss
.form-search { // componente

	.field	{ /* ... */ }	// elemento
	.button	{ /* ... */ }	// elemento
}
```

![Elementos](https://raw.githubusercontent.com/I2BTech/MutableCSS/master/images/elementos.png)

**Palabras múltiples:** Cuando necesites utilizar nombres compuestos para tu clase, déjalas juntas sin guión:

```scss
.box-user-profile {

	.firstname 	{ /* ... */ }
	.lastname 	{ /* ... */ }
	.email 		{ /* ... */ }
}
```

**Evita selectores de etiquetas:** prefiere utilizar clases CSS en vez de etiquetas HTML como selectores, para mejor rendimiento y semántica.

```scss
.box-user-profile {

	h3    		{ /* nop */ }
	.firstname 	{ /* bien */ }
}
```

Si ves la necesidad de hacerlo (por ejemplo, para dar estilos todos los `<p>` dentro de un `<div class="box-content">` prefiere el selector de hijo directo `>`:

```scss
.box-content {

	> p { /* bueno ya */ }
}
```

Mutables
---------------

![Mutables](https://raw.githubusercontent.com/I2BTech/MutableCSS/master/images/componente-mutable.png)

Componentes y Elementos son mutables ya que pueden tener variaciones de estilos respecto a la definición general. Para esto se crean clases que aportan cambios a los estilos originales y se prefijan con un guión (`-`):

```scss
.box-user-profile {

	&.-wide  { }
	&.-small { }
}

.button{

	&.-disabled { }
}
```

Los tipos de variaciones se clasifican en 2 grupos: diseño y estado.

#### Diseño
Son los que cambian el estilo del elemento ó componente y los más comunes se listan a continuación:

- wide: `.-wide`
- narrow: `.-narrow`
- big: `.-big`
- small: `.-small`
- tall: `.-tall`
- short: `.-short`
- large: `.-large`
- lower: `.-lower`
- upper: `.-upper`
- centered: `.-centered`
- bold: `.-bold`
- light: `.-light`

#### Estado
Son los que cambian el estado de un elemento ó componente y los comunes son:

- `.-disabled`
- `.-enabled`
- `.-visible`
- `.-hidden`

**Uso:**

```html
<input class="button-send -disabled" />
```

Se permiten tener varios mutables por componente/elemento:

```html
<input class="button-send -wide -disabled" />
```

Consideraciones Generales
---------------

**Tamaños fijos**: evita darle ancho/alto fijo a componentes; excepciones son avatares, cajas de votación y otras.

**Evita propiedades de posicionamiento**: componentes y elementos deben ser creados de una manera en que sean reutilizables en diferentes contextos y debe respetar la grilla que la contiene.

Evita:

* Posicionamiento (`position`, `top`, `left`, `right`, `bottom`)
* Flotado (`float`, `clear`)
* Margen (`margin`)
* Tamaño (`width`, `height`)

Y utiliza las clases que la grilla te entrega.

**Define tamaño y posicionamiento en el contexto no en el componente:** Si necesitas definir estas propiedades, hazlo en el contexto del componente (ó en la región que lo contiene) no en la definición del componente:

```css
// CONTEXTO
. list-article {

	.box-article {
		width: 33.3%;
		float: left;
	}
}
// REGION
#header {

	.box-article {
		width: 33.3%;
		float: left;
	}
}

// COMPONENTE
.box-article {
  /* ... */
  
  // ELEMENTOS
  > .image 	{ /* ... */ }
  > .title 	{ /* ... */ }
  > .meta 	{ /* ... */ }
}
```


#### Licencia:

> **Mutable CSS** es distribuido bajo la licencia [Creative Commons Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/). 

> Copyright (c) 2015 por [Jorge Epuñan](https://github.com/juanbrujo)

#### TO-DO:
- <s>Agregar *Regiones*</s>
- <s>Normalizar nomenclatura de regiones, componentes y elementos (y sus mutables)</s>
- <s>Mejorar imágenes de ejemplos</s>
