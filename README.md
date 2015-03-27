Mutable CSS
=====

####Estándar para estructura CSS a través de *Regiones, Componentes, Elementos y Mutables*.


tl;dr (resumen)
-------

- Define **regiones**, zonas reutilizables que compondrán tu layout. Apóyate con el [seccionamiento de HTML5](http://blog.teamtreehouse.com/use-html5-sectioning-elements): `section, nav, aside, article, main, header, footer` y decláralas con ID's semánticos en el HTML. 
- Modulariza **componentes**, nómbralos con 2 palabras separadas por un guión (`-`): `.screenshot-image`.
- Components contienen **elementos**, nómbralos con 1 palabra: `.title`.
- Componentes y elementos tienen **mutables** que se declaran un guión (`-`) como prefijo y con nombre resumido (acrónimo): `.banner-secondary.-lg`.
- Componentes y elementos pueden ser heredados y no deben tener propiedades de posicionamiento y tamaño; defíneselos en su contexto.


##Estructura

###Regiones

###Componentes

![](images/component-example.png)

Cada pieza de la interfaz corresponde a un *componente* individual. Componentes serán nombrados con **por lo menos 2 palabras** separadas con un guión (`-`), por ejemplo:

* Un menú (`.menu-header`)
* Un formulario de búsqueda (`.form-search`)
* Una caja de perfil de usuario (`.box-user-profile`)

Nótese que el componente comienza con su función como componente (**menu, form, box**) y la siguiente palabra es el contexto ó función (**header, search, user profile**). Esto es para poder identificar rápida y fácilmente otros tipos de componentes similares, porque como sabemos existirán varios `.menu-` y muchos `.box-` entre otros.

### Elementos

![](images/component-elements.png)

Cada componente debiera tener algunos elementos. Los nombres de clases para elementos **tienen sólo una palabra**:

```scss
.form-search {

	.field 	{ /* ... */ }
	.button 	{ /* ... */ }
}
```

**Selectores:** Prefiere utilizar el selector de hijo `>` ya que previene que herede a otras declaraciones nietas:

```scss
.box-content {

	.title     { /* bien */ }
	> .author  { /* mejor */ }
}
```

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

Si vez la necesidad de hacerlo (por ejemplo, para estilizar todos los `<p>` dentro de un `<div class="box-content">` utiliza el selector de hijo directo `>`:

```scss
.box-content {

	> p { /* bueno ya */ }
}
```

### Mutables

![](images/component-modifiers.png)

Componentes pueden tener mutables. Estas clases que aportan cambios a los estilos originales de un componentes se prefijan con un guión (`-`):

```scss
.box-user-profile {

	&.-wide { }
	&.-small { }
}

.button-send {

	&.-disabled { }
}
```

Elementos también pueden tener mutables:

```scss
.box-price {

	.value {
		
		&.-small { }
	}
```

**Uso:**

```html
<input class="button-send -disabled" />
```

### Componentes anidados

![](images/component-nesting.png)

Habrán veces que sea necesario anidar componentes:

```html
<div class='box-article'>
	<div class='box-vote'>
  		...
	</div>
	<h3 class='title'>...</h3>
	<p class='meta'>...</p>
</div>
```
<s>
Y habrán otras veces que al anidar componentes, el markup quedará algo sucio:

```html
<div class='box-article'>
	<div class='box-excerpt'>
  		<h4 class='title'>...</h4>
  		...
	</div>
	<div class='box-vote'>
  		...
	</div>
	<h3 class='title'>...</h3>
	<p class='meta'>...</p>
</div>
```
</s>

Prefiere simplificar y reutilizar componentes utilizando `@extend` de Sass y escríbelas en la primera línea de los bloques declarativos:

```html
<div class='search-form'>
	<input class='input' type='text' />
	<button class='submit'></button>
</div>
```

```scss
.search-form {
	> .submit {
		@extend .search-button;
		@extend .search-button.-large;
		
		background-color: lightgray;
	}
}
```

Prefiere agrupar las declaraciones `@include` en la parte superior del bloque y luego de las declaraciones `@extend`:

```scss
.selector {
	@extend .element;
	@include clearfix();
	
	width: 5em;
}
```

### Layout

![](images/layouts.png)

**Evita propiedades de posicionamiento**: componentes deben ser realizados de una manera en que sean reutilizables en diferentes contextos y debe respetar la grilla que la contiene.

Evita estas propiedades en componentes:

* Posicionamiento (`position`, `top`, `left`, `right`, `bottom`)
* Float (`float`, `clear`)
* Margin (`margin`)
* Tamaño (`width`, `height`)

Y utiliza las clases que la grilla te entrega.

**Tamaños fijos**: evita darle ancho/alto fijo a componentes; excepciones son avatares, cajas de votación y algunas otras.

**Define tamaño y posicionamiento en el contexto no en el componente:** Si necesitas definir estas propiedades, hazlo en el contexto del componente no en la definición del componente:

```css
// CONTEXTO
. list-article {

	.box-article {
		width: 33.3%;
		float: left;
	}
}

// COMPONENTE
.box-article {
  /* ... */
  
  > .image 	{ /* ... */ }
  > .title 	{ /* ... */ }
  > .meta 	{ /* ... */ }
}
```

Estructura CSS
-------------

### Un archivo de componentes

```scss
/* src/scss/include/components.scss */
.search-form {
  > .button { /* ... */ }
  > .field 	{ /* ... */ }
  > .label 	{ /* ... */ }

  // variantes
  &.-small 	{ /* ... */ }
  &.-wide 	{ /* ... */ }
}
```

### Evita sobre-anidado en Scss

Evita más de 2 niveles de anidado:

```scss
.user-profile {

	> .description {

		> .icon {
			/* ... */
		}
	}
	a {
  	
		&:hover {
			/* ... */
		}
	}
}
```

Mejor:

```scss
.image-frame {
  > .description { 
  	/* ... */ 
  }
  > .description > .icon { 
  	/* ... */ 
  }
}
```

### Herencia de estilos

Cuidado con la herencia de contenido, para eso recuerda que puedes utilizar el selector de hijo `>`:

```html
<article class='article-link'>
  <div class='box-vote'>
    <button class='add'></button>
    <button class='rest'></button>
    <span class='count'></span>
  </div>

  <h3 class='title'>Article title</h3>
  <p class='count'>3 votes</p>
</article>
```

```scss
.article-link {
  > .title 	{ /* ... */ }
  > .count 	{ /* ... (!!!) */ }
}

.box-vote {
  .add 		{ /* ... */ }
  .rest 	{ /* ... */ }
  .count 	{ /* ... */ }
}
```

En este caso si no definieras `.article-link > .count` este estilo lo habría heredado `.box-vote .count`.

#### TO-DO:
- Agregar *Regiones*
- Normalizar nomenclatura de regiones, componentes y elementos (y sus estados)
- Mejorar imágenes de ejemplos
