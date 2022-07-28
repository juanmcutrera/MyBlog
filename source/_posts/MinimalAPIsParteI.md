---
title: Paso a paso, cómo desarrollar Minimal APIs en ASP.NET Core 6 con Visual Studio Code (Parte I)
date: 2022-07-24 19:53:36
header-img: /images/posts/2022/MinimalAPIsParteI/Minimal APIs Parte I.png
header-img-thumb: /images/posts/2022/MinimalAPIsParteI/Minimal APIs Parte I thumb.png
header-img-alt: Minimal APIs para simplificar el código
header-img-title: Minim al APIs en ASP.NET Core 6
tags:
 [.NET 6,
 Minimal APIs,
 ASP.NET Core Entity Framework]
categories: 
 - [.NET]

---

> ASP.NET Core 6 nos ofrece un enfoque de desarrollo de APIs HTTP más liviano en comparación al tradicional de ASP.NET MVC, llamado APIs Mínimas o Minimal APIs. La reducción y optimización de código puede traducirse en mejoras de performance y en una simplificación de nuestro proceso de desarrollo de aplicaciones web.
Voy escribir una serie de artículos sobre está temática experimentando con sus distintas posibilidades.

### Introducción

Para comenzar necesitás tener instalado en tu equipo .NET 6.
Si no sabés que versiones de .NET tenés instaladas, abrí una terminal - en mi caso utilizo powershell * en Visual Studio Code ** (que es un IDE liviano y libre)  - y ejecutá el siguiente comando:

```  
dotnet --list-sdks
```
<img src="/images/posts/2022/MinimalAPIsParteI/Net List SDKs.png" loading="lazy" decoding="async" 
title=".NET SDKs 6" 
alt=".NET SDKs instalados" 
class="article-image"/>


Las distintas versiones de .NET las encontrás en https://dotnet.microsoft.com/en-us/download
.NET Core es libre, de código abierto y multiplataforma. Funciona eficientemente en sistemas Windows, Linux y macOS.
Un punto interesante y que nos da tranquilidad, es que .NET 6 nos brinda actualmente una versión LTS (acrónimo de **L**ong **T**erm **S**upport o soporte a largo plazo). Este servicio no aplica en .NET 5.0 cuyo soporte a la fecha caducó. 
Por esta cuestión, en una compañía a la cual proporciono servicios de desarrollo tuvimos que migrar de versión .NET 5.0 a .NET 6.0 en cuestión de pocos meses con los percances que ocasiona este proceso.
Una vez verificado que tenés instalado .NET 6, procedé con la creación de un proyecto web con minimal APIs utilizando la plantilla vacía de ASP.NET. 
Creá tu proyecto dentro de una carpeta con un nombre acorde y ejecutá el comando

``` 
dotnet new web
```

HTTPS se ha convertido en el estándar para ambientes de producción como de desarrollo, por lo tanto, si te aparece el error de confianza de certificado, tenés que ejecutar el siguiente comando para desarrollar bajo HTTPS con un certificado auto firmado

``` 
dotnet  dev-certs https
```
Ahora podés ejecutar la aplicación creada dentro de la carpeta con el comando
``` 
dotnet run
```

<img src="/images/posts/2022/MinimalAPIsParteI/Ejecutar web app en Visual Studio Code.png" loading="lazy" decoding="async" 
title="Generar certificado HTTPS y ejecutar Web App Visual en Studio Code" 
alt="Generar certificado HTTPS y ejecutar Web App Visual en Studio Code" 
class="article-image"/>

Observá que la interfaz de línea de comando .NET (.NET cli) genera 
un único método que arroja el famoso mensaje “Hello World” con solo cuatro líneas de código. ¿No te parece sencillo y eficiente?

``` csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/", () => "Hello World!");
app.Run();
```

Podés ejecutar la API en un navegador o en una plataforma de gestión de APIs como Postman importando el siguiente fragmento de código como texto bruto (Raw text):

``` 
curl --location --request GET 'http://localhost:5046/'
```
Para cambiar las configuraciones de URLs, entornos, entre otras opciones, editá el archivo launchSettings.json en la carpeta Properties.

<img src="/images/posts/2022/MinimalAPIsParteI/Launchsettings.png" loading="lazy" decoding="async" 
title="Archivo launchSetting.json" 
alt="Archivo launchSetting.json para editar configuraciones como applicationUrl y environmentVariables" 
class="article-image"/>

Si eliminás el mismo la API se ejecutará en
http://localhost:5000
https://localhost:5001
en Hosting environment: Production.

ASP.NET Core 6 utiliza los métodos MapPost(), MapGet(),MapPut(), MapDelete() para definir rutas y manejadores con Minimal APIs ligados a operaciones de inserción ,listado, modificación y borrado, también llamadas CRUD (acrónimo de **C**reate, **R**ead, **U**pdate, **D**elete).

A continuación modificá el código de la clase Program.cs para incluir cuatro nuevos llamados API:

``` csharp
app.MapGet("/parameters", () => "List all parameters.");
app.MapPost("/parameter", () => "Add parameter.");
app.MapPut("/parameter", () => "Edit parameter.");
app.MapDelete("/parameter", () => "Delete parameter.");
```


Nuevamente podés ejecutar las APIs en un navegador o en Postman importando los siguientes fragmentos de código como texto bruto (Raw text):


``` 
curl --location --request GET 'http://localhost:5046/parameters'

curl --location --request POST 'http://localhost:5046/parameter'

curl --location --request PUT 'http://localhost:5046/parameter'

curl --location --request DELETE 'http://localhost:5046/parameter'
```
 

### ASP.NET Core Entity Framework

Para desarrollar las operaciones CRUD utilizaremos la base de datos SQLite con Entity Framework Core e instalación vía “Migrations”.
Agregá los paquetes necesarios ejecutando por terminal los siguientes comandos:

``` 
dotnet add package Microsoft.Design
dotnet add package Microsoft.Tools
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.InMemory
dotnet add package Microsoft.Sqlite
```

Estos comandos instalan las últimas versiones de los paquetes. Si tenés problemas de compatibilidad o querés utilizar una versión anterior podés especificarlo como en el siguiente ejemplo:

``` 
dotnet add package Microsoft.EntityFrameworkCore -v 6.0.6
```
Ahora instalá **dotnet ef** en forma global que es la más común:

``` 
dotnet tool install --global dotnet-ef
```

Ejecutá los dos comandos para crear la base de datos. El primer comando configura los archivos necesarios de migración (utilizo el nombre “Initial”) para que se generen dentro de la carpeta Data/Migrations del proyecto (podés modificar las ruta a tu medida). 

```

dotnet ef migrations add "Initial" --project ../MinimalAPIs/MinimalAPIs.csproj -o "../MinimalAPIs/Data/Migrations"
```
El segundo comando aplica la configuración generada y crea la base de datos Eco.db dentro de la carpeta Data. 

``` 
dotnet ef database update
```
Para parametrizar la base de datos utilizá la ruta contenida en la sección connectionString, AppDb del archivo appsettings.json. 
Migrations utiliza la configuración del DbContext a la que llamaremos AppDbContext.

Para realizar las operaciones de SQLite te recomiendo instalar una extensión de Visual Studio Code como SQLite.

<img src="/images/posts/2022/MinimalAPIsParteI/SQLite Extension.png" loading="lazy" decoding="async" 
title="Extensión SQLite" 
alt="Instalación Extensión SQLite para Visual Studio Code" 
class="article-image"/>

<img src="/images/posts/2022/MinimalAPIsParteI/SQLite New Query.png" loading="lazy" decoding="async" 
title="Extensión SQLite - New Query" 
alt="Ejecución SQLite para Visual Studio Code - New Query" 
class="article-image"/>

<img src="/images/posts/2022/MinimalAPIsParteI/SQLite Run Query.png" loading="lazy" decoding="async" 
title="Extensión SQLite - Run Query" 
alt="Ejecución SQLite para Visual Studio Code - Run Query" 
class="article-image"/>



Hasta aquí lo relacionado con Entity Framework Core.

Ahora podés instalar Swagger *** ejecutando por terminal el comando

``` 
dotnet add package Swashbuckle.AspNetCore 
```

A continuación, modificá el archivo Program.cs. No soy proclive a comentar código, en este caso apunto a clarificar como desarrollar las operaciones CRUD.


``` csharp
var builder = WebApplication.CreateBuilder(args);

//Agregado del servicio Swagger.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Configuración de la base de datos vía appsettings.json.
var connectionString = builder.Configuration["ConnectionStrings:AppDb"];

//Agregado del DbContext a los servicios para la utilización de la base de datos SQLite a la que llamé Eco.
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

var app = builder.Build();

//Inicialización de Swagger en un entorno de desarrollo.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

//API para obtener objetos de tipo Parameter previamente ingresados o un resultado vacío (recibe como parámetro el DbContext).
app.MapGet("/parameters", async ( AppDbContext context ) =>
{
    var parameterslst = await context.Parameters.ToListAsync();
    if (parameterslst.Count() > 0)
    {
        return Results.Created($"/parameters/{parameterslst}", parameterslst);
    }
    return Results.NotFound("There are no parameters.");
});

//API para insertar un objeto Parameter o visualizar un mensaje de objeto previamente agregado (recibe el DbContext y un objeto de tipo Parameter).
app.MapPost("/parameter", async ( AppDbContext context, Parameter ) => 
{    
    if (await context.Parameters.FindAsync(parameter.Id) == null ) 
    {      
        parameter.Created = DateTime.Now;
        await context.Parameters.AddAsync(parameter);
        await context.SaveChangesAsync();    
        return Results.Created($"/parameter/{parameter}",   parameter);         
    }       
    return Results.BadRequest("Parameter already exists.");    
});

//API para modificar un objeto Parameter previamente ingresado o visualizar un mensaje de objeto inexistente (recibe el DbContext y un objeto de tipo Parameter).
app.MapPut("/parameter", async ( AppDbContext context, , Parameter ) => 
{
    var parameterup =  await context.Parameters.FindAsync(parameter.Id);
    if (parameterup != null)
    {        
        parameterup.Description = parameter.Description;
        parameterup.Updated = DateTime.Now;
        await context.SaveChangesAsync();
        return Results.Ok(parameterup);
    }
    return Results.NotFound("Parameter does not exist.");
});

//API para eliminar un objeto Parameter previamente ingresado o visualizar un mensaje de objeto inexistente (recibe el DbContext y el id del Parameter).
app.MapDelete("/parameter/{id}", async ( AppDbContext context, int id ) => 
{
    if (await context.Parameters.FindAsync(id) is Parameter parameter) {
        context.Parameters.Remove(parameter);
        await context.SaveChangesAsync();
        return Results.Ok(parameter);
    }
    return Results.NotFound("Parameter does not exist.");
});

app.Run();

//Definición de la clase Parameter.
public class Parameter
{
    public int Id { get; set; }
    public string? Description { get; set; }    
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
    
}

//Definición del DbContext para la utilización de la tabla Parameter de la base de datos.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options):base(options)
    {
    }
    public DbSet< Parameter>  Parameters { get; set; } = null!;        
}
```
Podés pasar como segundo parámetro de un método de API (delegate handler) un método desarrollado a medida. Una opción sería modificar el método de API MapPost() de la siguiente forma:

``` csharp
app.MapPost("/parameter", Add );
async Task<IResult> Add(AppDbContext context, Parameter )
{
    if (await context.Parameters.FindAsync(parameter.Id) == null ) 
    {      
        parameter.Created = DateTime.Now;
        await context.Parameters.AddAsync(parameter);
        await context.SaveChangesAsync();    
        return Results.Created($"/parameter/{parameter}", parameter);         
    }       
    return Results.BadRequest("Parameter already exists.");   
}  
```

### Test Unitarios


No nos olvidemos de los test. Muchas veces los hemos desestimado por comodidad, dificultad o desconocimiento. Como toda práctica en programación, necesitamos aprender los fundamentos, ejercitar y mejorar con cada uno de nuestros proyectos. Sin dudas los test son una herramienta que apunta a aplicar buenas prácticas de desarrollo, y por ende, a mejorar la calidad del software.
Este artículo no pretende profundizar en detalle sobre test unitarios pero puede servir como introducción y guía. 
Utilizaremos el paquete **XUnit**.

Separá los métodos de test creando un nuevo proyecto. Para esto ejecutá el comando


``` 
dotnet new xunit -n MinimalAPIs.Test 
```

que genera la plantilla .NET con los archivos y paquetes esenciales para comenzar a desarrollar métodos de test.

Es imprescindible modificar el archivo del proyecto base (al que llamé MinimalAPIs.csproj) para incorporar el atributo **InternalsVisibleTo** 

``` 
<ItemGroup>
     <InternalsVisibleTo Include="MinimalAPIs.Test" />
</ItemGroup>
```


De esta forma el proyecto de test puede tener visibilidad del archivo Program.cs.

Generá la referencia al proyecto base en el proyecto de test con el comando

``` 
dotnet add reference  ../MinimalAPIs/MinimalAPIs.csproj
```


Una buena forma de estructurar los test es utilizar el patrón **AAA** (acrónimo de **A**rrange-**A**ct-**A**ssert).
AAA describe tres fases o pasos involucrados en el test dentro de un método:
**Arrange**: en esta fase se configuran e inicializan los objetos que sirven de entrada para el test.
**Act**: esta fase contiene el comportamiento principal del test. Puede estar relacionado a la llamada a un método como una API Rest.
**Arrange**: esta etapa se utiliza para verificar el resultado del test, es decir, si se cumple o falla.

Para escribir los test podés utilizar los archivos de clases que consideres necesarios. Como se trata de una aplicación simple, te propongo utilizar una única clase a la que llamo UnitTest.cs.

A continuación podés ver la clase TestAplication que es una fábrica que crea el Host con una base de datos en memoria en reemplazo de SQLite. Es importante destacar el punto de entrada de la fábrica que es la clase Program.cs del proyecto base.


``` csharp
class TestApplication : WebApplicationFactory<Program>
{
    protected override IHost CreateHost(IHostBuilder builder)
    {   
     	builder.ConfigureServices(services =>
        {	        
            //Los servicio de tipo Scoped se crean una vez por solicitud. 
            services.AddScoped(sp =>
            {   
                //La base de datos en memoria Eco contine la estructura del DbContext.       
                return new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("Eco")
                .UseApplicationServiceProvider(sp)
                .Options;                 
            });
        }); 
        return base.CreateHost(builder);
    }
}
```

El siguiente es un test simple con aplicación de las tres fases AAA. El atributo **[Fact]** declara un método de prueba que el ejecutor o gestor de pruebas puede correr.



``` csharp
    [Fact]
    public async Task GetHelloWorld()
    {                 
         // Arrange	    
        //Instancia de la aplicación para crear un cliente Http.
        await using var application = new TestApplication();    
        HttpClient client = application.CreateClient();
        
        // Act
        //Ejecución asincrٴónica del método API Get en la ruta base.
        using var response = await client.GetAsync("/");
        response.EnsureSuccessStatusCode();
        //Resultado en formato String del método ejecutado.
        var responseBody = await response.Content.ReadAsStringAsync(); 

        // Assert       	    
        //Validación de coincidencia entre el resultado del método y la frase “Hello World!” 
        Assert.Matches("Hello World!", responseBody);        
    }
```

A continuación te muestro test de la creación de un objeto Parameter a partir de la ejecución de un método de API Post.

``` csharp
    [Fact]
    public async Task PostParameterAsJsonStatusCreated()
    {        
         // Arrange
        //Instancia de la aplicación para crear un cliente Http. 	    
        await using var application = new TestApplication();    
        HttpClient client = application.CreateClient();

        //Objeto Parameter a crear a través del método POST.
        int id = 123;
        string description = "Parameter 123";
        Parameter = new Parameter() { Id = id, Description = description };     
        
        // Act              
        //Ejecución asincrٴónica del método de API POST con el parámetro de entrada parameter. 
        var response = await client.PostAsJsonAsync("/parameter", parameter);
        //Resultado en formato Json del método ejecutado.
        var result = await response.Content.ReadFromJsonAsync<Parameter>();
       
        // Assert 
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);   
        //Validación de coincidencia entre la variable id y el campo Id del objeto Parameter   
        creado y devuelto.      
        Assert.Equal(id, result?.Id);
        //Validación de coincidencia entre la variable description y el campo Description del 
        objeto Parameter creado y devuelto.      
        Assert.Equal(description, result?.Description);        
    }
```
Te dejo el resto de los test disponibles para descarga.

Para ejecutarlos todos a la vez podés usar el comando 


``` 
dotnet test 
```

o individualmente

``` 

dotnet test --filter "FullyQualifiedName=MinimalAPIs.Test.UnitTest.PostParameterAsJsonStatusCreated"
```

Resulta más eficiente instalar una extensión como **.NET Core Test Explorer** que nos permite realizar pruebas individuales y completas utilizando una interfaz gráfica muy sencilla y amigable.

<img src="/images/posts/2022/MinimalAPIsParteI/NET Core Test Explorer.png" loading="lazy" decoding="async" 
title="Extensión .NET Core Test Explorer" 
alt="Extensión .NET Core Test Explorer para Visual Studio Code" 
class="article-image"/>

Luego de ejecutar los test con resultados válidos, la aplicación estaría en condiciones de probarse en Postman importando los siguientes fragmentos de código como texto bruto (Raw text):


``` 
curl --location --request GET 'http://localhost:5046/parameters'

curl --location --request POST 'http://localhost:5046/parameter' \
--header 'Content-Type: application/json' \
--data-raw '{
"Id" : 1,
"Description" : "Parameter 1"
}'

curl --location --request PUT 'http://localhost:5046/parameter' \
--header 'Content-Type: application/json' \
--data-raw '{
"Id" : 1,
"Description" : "Parameter 1.1"
}'

curl --location --request DELETE 'http://localhost:5046/parameter/1'
```

<img src="/images/posts/2022/MinimalAPIsParteI/Postman POST.png" loading="lazy" decoding="async" 
title="Postman - POST" 
alt="Post en Postman con Minimal APIs" 
class="article-image"/>


También podés probar las APIs accediendo a Swagger a través de:

http://localhost:5046/swagger/index.html


<img src="/images/posts/2022/MinimalAPIsParteI/Swagger POST.png" loading="lazy" decoding="async" 
title="Swagger - POST" 
alt="Post en Swagger con Minimal APIs" 
class="article-image"/>


### Conclusión

Hemos desarrollado un paquete de operaciones CRUD con minimal APIs reduciendo el código y eliminando la necesidad del archivo Startup.cs necesario en versiones anteriores de .NET Core.
En el link de descarga https://github.com/juanmanuelcutrera/NET podés acceder al código del artículo. Organicé la aplicación en subcarpetas para separar funcionalidades y evitar un mínimo de código espagueti en el archivo Program.cs. No obstante, podés refactorizar el código e incluir más tests hasta el punto que te parezca conveniente.

(*) 
https://code.visualstudio.com/download

(**)
https://docs.microsoft.com/es-es/powershell/

(***)
https://docs.microsoft.com/es-es/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-6.0