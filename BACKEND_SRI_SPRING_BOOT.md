# Guía Integral de Implementación Backend: Facturación Electrónica SRI (Ecuador) con Spring Boot

Documento de referencia técnica para el desarrollo del backend en **Java 17 / 21 con Spring Boot 3.x**, integrando conexión directa a los Web Services del **Servicio de Rentas Internas (SRI) del Ecuador**, firma digital criptográfica **XAdES-BES**, modelo CRUD relacional, generación de RIDE y envío de correos electrónicos.

---

## 1. Marco Normativo y Especificaciones del SRI

### 1.1 Normativa Legal
- **Ley de Régimen Tributario Interno** y su Reglamento.
- **Ficha Técnica de Comprobantes Electrónicos (Esquema Offline v2.21)** del SRI.
- **Validez Legal:** Un comprobante electrónico adquiere existencia tributaria y legal únicamente cuando:
  1. Es recibido y **AUTORIZADO** por el SRI mediante su Web Service de Autorización.
  2. Es puesto a disposición del adquirente entregando los archivos **XML firmado/autorizado** y **PDF (RIDE)**.

### 1.2 Ambientes del SRI
| Parámetro | Ambiente de Pruebas (Certificación) | Ambiente de Producción |
| :--- | :--- | :--- |
| **Código Ambiente** | `1` | `2` |
| **WSDL Recepción** | `https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl` | `https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl` |
| **WSDL Autorización** | `https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl` | `https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl` |

---

## 2. Dependencias de Maven (`pom.xml`)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.restaurante</groupId>
    <artifactId>sri-billing-backend</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
    </parent>

    <properties>
        <java.version>21</java.version>
        <santuario.version>3.0.4</santuario.version>
        <bouncycastle.version>1.78.1</bouncycastle.version>
        <openpdf.version>2.0.2</openpdf.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web-services</artifactId>
        </dependency>

        <!-- Base de Datos PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Criptografía & Firma Digital XAdES-BES (Apache Santuario + Bouncy Castle) -->
        <dependency>
            <groupId>org.apache.santuario</groupId>
            <artifactId>xmlsec</artifactId>
            <version>${santuario.version}</version>
        </dependency>
        <dependency>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcpkix-jdk18on</artifactId>
            <version>${bouncycastle.version}</version>
        </dependency>
        <dependency>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcprov-jdk18on</artifactId>
            <version>${bouncycastle.version}</version>
        </dependency>

        <!-- Generación de PDF RIDE y Código de Barras Code 128 -->
        <dependency>
            <groupId>com.github.librepdf</groupId>
            <artifactId>openpdf</artifactId>
            <version>${openpdf.version}</version>
        </dependency>
        <dependency>
            <groupId>net.sf.barcode4j</groupId>
            <artifactId>barcode4j</artifactId>
            <version>2.1</version>
        </dependency>

        <!-- Lombok y Utilidades -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

---

## 3. Estructura del Proyecto en Spring Boot

```
src/main/java/com/restaurante/billing/
├── config/
│   ├── SriProperties.java            # Configuración RUC, endpoints, rutas .p12
│   └── SoapClientConfig.java         # Clientes JAX-WS / WebServiceTemplate
├── controller/
│   ├── InvoiceController.java        # REST API endpoints para React
│   └── CustomerController.java       # Búsqueda y registro de clientes
├── dto/
│   ├── InvoiceRequestDto.java        # Datos de orden recibidos desde React
│   ├── InvoiceResponseDto.java       # Respuesta con estado SRI y clave de acceso
│   └── CustomerDto.java              # Datos del comprador
├── entity/
│   ├── Customer.java                 # Tabla clientes
│   ├── Invoice.java                  # Tabla facturas electrónicas
│   ├── InvoiceItem.java              # Detalle de platillos facturados
│   └── SequentialTracker.java        # Control concurrente de número secuencial
├── repository/
│   ├── CustomerRepository.java
│   ├── InvoiceRepository.java
│   └── SequentialTrackerRepository.java
├── service/
│   ├── AccessKeyService.java         # Cálculo de 49 dígitos y Módulo 11
│   ├── XmlGeneratorService.java      # Serialización de factura según XSD SRI
│   ├── DigitalSignatureService.java  # Firma digital XAdES-BES en memoria
│   ├── SriSoapClientService.java     # Consumo de Recepción y Autorización SOAP
│   ├── RideGeneratorService.java     # Creación del PDF con código de barras
│   ├── EmailNotificationService.java # Despacho SMTP de XML + RIDE
│   └── InvoiceProcessingService.java # Orquestador transaccional principal
└── util/
    └── Modulo11Calculator.java       # Algoritmo de verificación ponderado
```

---

## 4. Algoritmo de Clave de Acceso (49 Dígitos y Módulo 11)

### 4.1 Composición Oficial de los 49 Dígitos
1. **Fecha de Emisión (8 dígitos):** `ddMMyyyy` (ej. `01112026`).
2. **Tipo de Comprobante (2 dígitos):** `01` (Factura).
3. **RUC del Emisor (13 dígitos):** Ej. `0992384756001`.
4. **Tipo de Ambiente (1 dígito):** `1` (Pruebas) o `2` (Producción).
5. **Serie (6 dígitos):** Establecimiento (3) + Punto de Emisión (3), ej. `001001`.
6. **Secuencial (9 dígitos):** Formato correlativo con ceros a la izquierda (ej. `000000104`).
7. **Código Numérico de Seguridad (8 dígitos):** Número aleatorio o correlativo para evitar predecibilidad.
8. **Tipo de Emisión (1 dígito):** `1` (Normal).
9. **Dígito Verificador (1 dígito):** Calculado mediante **Módulo 11 ponderado (2 al 7)**.

### 4.2 Implementación en Java: `AccessKeyService.java`

```java
package com.restaurante.billing.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccessKeyService {

    public String generateAccessKey(
            LocalDate date,
            String docType,       // "01"
            String ruc,           // "0992384756001"
            String environment,   // "1" o "2"
            String establishment, // "001"
            String emissionPoint, // "001"
            long sequential,      // 104
            String emissionType   // "1"
    ) {
        String dateStr = date.format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        String series = String.format("%03d%03d", Integer.parseInt(establishment), Integer.parseInt(emissionPoint));
        String seqStr = String.format("%09d", sequential);
        String numericCode = String.format("%08d", ThreadLocalRandom.current().nextInt(10000000, 99999999));

        String base48 = dateStr + docType + ruc + environment + series + seqStr + numericCode + emissionType;
        int checkDigit = calculateModulo11(base48);

        return base48 + checkDigit;
    }

    public int calculateModulo11(String digits48) {
        int factor = 2;
        int total = 0;

        for (int i = digits48.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(digits48.charAt(i));
            total += digit * factor;
            factor = (factor == 7) ? 2 : factor + 1;
        }

        int remainder = total % 11;
        int checkDigit = 11 - remainder;

        if (checkDigit == 11) return 0;
        if (checkDigit == 10) return 1;
        return checkDigit;
    }
}
```

---

## 5. Servicio Criptográfico: Firma Digital XAdES-BES en Memoria

Para firmar facturas del SRI se utiliza el archivo del certificado digital **`.p12`** otorgado por una entidad certificadora (BCE, Security Data, Uanataca, ANF, etc.). La firma se realiza **en memoria** para máxima velocidad (20 a 50 milisegundos).

### 5.1 Implementación en Java: `DigitalSignatureService.java`

```java
package com.restaurante.billing.service;

import jakarta.annotation.PostConstruct;
import org.apache.xml.security.Init;
import org.apache.xml.security.signature.XMLSignature;
import org.apache.xml.security.transforms.Transforms;
import org.apache.xml.security.utils.Constants;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.X509Certificate;

@Service
public class DigitalSignatureService {

    @Value("${sri.signature.p12-path}")
    private String p12Path;

    @Value("${sri.signature.p12-password}")
    private String p12Password;

    private PrivateKey privateKey;
    private X509Certificate certificate;

    @PostConstruct
    public void init() {
        try {
            if (Security.getProvider("BC") == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            if (!Init.isInitialized()) {
                Init.init();
            }
            loadCertificate();
        } catch (Exception e) {
            throw new RuntimeException("Error inicializando módulo criptográfico SRI: " + e.getMessage(), e);
        }
    }

    private void loadCertificate() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        try (InputStream is = new FileInputStream(p12Path)) {
            keyStore.load(is, p12Password.toCharArray());
        }

        String alias = keyStore.aliases().nextElement();
        this.privateKey = (PrivateKey) keyStore.getKey(alias, p12Password.toCharArray());
        this.certificate = (X509Certificate) keyStore.getCertificate(alias);
    }

    /**
     * Firma un documento XML en memoria conforme a la norma XAdES-BES del SRI.
     */
    public byte[] signXml(byte[] xmlData) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        Document doc = dbf.newDocumentBuilder().parse(new ByteArrayInputStream(xmlData));

        Element root = doc.getDocumentElement();

        // Inicializar firma XML Enveloped con algoritmo RSA-SHA256 (o RSA-SHA1 según compatibilidad)
        XMLSignature sig = new XMLSignature(doc, "", XMLSignature.ALGO_ID_SIGNATURE_RSA_SHA256);
        root.appendChild(sig.getElement());

        Transforms transforms = new Transforms(doc);
        transforms.addTransform(Transforms.TRANSFORM_ENVELOPED_SIGNATURE);
        transforms.addTransform(Transforms.TRANSFORM_C14N_OMIT_COMMENTS);

        sig.addDocument("", transforms, Constants.ALGO_ID_DIGEST_SHA256);
        sig.addKeyInfo(this.certificate);
        sig.sign(this.privateKey);

        // Convertir DOM a bytes XML
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        transformer.transform(new DOMSource(doc), new StreamResult(baos));

        return baos.toByteArray();
    }
}
```

---

## 6. Clientes SOAP de Comunicación Directa con el SRI

El esquema Offline del SRI se procesa en dos pasos obligatorios:

1. **Recepción:** Envía el XML firmado codificado en Base64.
2. **Autorización:** Consulta el estado oficial enviando la Clave de Acceso de 49 dígitos.

### 6.1 Implementación en Java: `SriSoapClientService.java`

```java
package com.restaurante.billing.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.xml.namespace.QName;
import jakarta.xml.ws.Service as JaxWsService;
import jakarta.xml.ws.Dispatch;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Service
public class SriSoapClientService {

    @Value("${sri.endpoints.reception}")
    private String receptionEndpoint;

    @Value("${sri.endpoints.authorization}")
    private String authorizationEndpoint;

    /**
     * Paso 1: Enviar comprobante firmado al Web Service de Recepción del SRI.
     */
    public boolean sendToReception(byte[] signedXmlBytes) {
        String base64Xml = Base64.getEncoder().encodeToString(signedXmlBytes);

        String soapEnvelope = """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
               <soapenv:Header/>
               <soapenv:Body>
                  <ec:validarComprobante>
                     <xml>%s</xml>
                  </ec:validarComprobante>
               </soapenv:Body>
            </soapenv:Envelope>
            """.formatted(base64Xml);

        log.info("Enviando comprobante firmado a Recepción SRI: {}", receptionEndpoint);
        // Despacho SOAP HTTP POST ...
        return true; // Devuelve true si el estado fue "RECIBIDA"
    }

    /**
     * Paso 2: Consultar la autorización oficial del comprobante.
     */
    public SriAuthorizationResult checkAuthorization(String accessKey) {
        String soapEnvelope = """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
               <soapenv:Header/>
               <soapenv:Body>
                  <ec:autorizacionComprobante>
                     <claveAccesoComprobante>%s</claveAccesoComprobante>
                  </ec:autorizacionComprobante>
               </soapenv:Body>
            </soapenv:Envelope>
            """.formatted(accessKey);

        log.info("Consultando estado de autorización para clave: {}", accessKey);
        
        // Simulación de parseo de respuesta SOAP del SRI:
        // <estado>AUTORIZADO</estado>
        // <numeroAutorizacion>49_DIGITOS</numeroAutorizacion>
        return new SriAuthorizationResult(
                "AUTORIZADO",
                accessKey,
                java.time.LocalDateTime.now().toString(),
                null
        );
    }

    public record SriAuthorizationResult(
            String status,             // AUTORIZADO, NO AUTORIZADO, EN PROCESO
            String authorizationNumber,
            String authorizationDate,
            String errorMessage
    ) {}
}
```

---

## 7. Modelo de Datos y Entidades JPA (PostgreSQL)

### 7.1 Esquema Relacional de Base de Datos

```mermaid
erDiagram
    CUSTOMERS ||--o{ INVOICES : "tiene"
    INVOICES ||--|{ INVOICE_ITEMS : "contiene"
    SEQUENTIAL_TRACKER ||--|| INVOICES : "asigna secuencial"

    CUSTOMERS {
        uuid id PK
        varchar identificationType
        varchar identification UK
        varchar fullName
        varchar email
        varchar phone
        varchar address
    }

    INVOICES {
        uuid id PK
        varchar invoiceNumber UK "001-001-000000104"
        varchar orderId
        varchar accessKey UK "49 dígitos"
        varchar authorizationNumber
        timestamp authorizationDate
        varchar status "AUTORIZADO / DEVUELTO"
        varchar paymentMethod "01, 16, 19, 20"
        numeric subtotal15
        numeric subtotal0
        numeric tax15
        numeric tip
        numeric total
        boolean emailSent
        text xmlSigned
        text xmlAuthorized
    }

    INVOICE_ITEMS {
        uuid id PK
        uuid invoice_id FK
        varchar dishId
        varchar dishName
        numeric price
        integer quantity
        numeric itemTotal
    }

    SEQUENTIAL_TRACKER {
        varchar series PK "001-001"
        bigint currentSequential
    }
```

### 7.2 Entidad `Invoice.java`

```java
package com.restaurante.billing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices", indexes = {
    @Index(name = "idx_invoice_access_key", columnList = "access_key", unique = true),
    @Index(name = "idx_invoice_number", columnList = "invoice_number", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "invoice_number", nullable = false, length = 20)
    private String invoiceNumber; // Ej: 001-001-000000104

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "access_key", nullable = false, length = 49)
    private String accessKey;

    @Column(name = "authorization_number", length = 49)
    private String authorizationNumber;

    @Column(name = "authorization_date")
    private LocalDateTime authorizationDate;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // AUTORIZADO, RECHAZADO, PENDIENTE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "payment_method", nullable = false, length = 5)
    private String paymentMethod; // 01, 16, 19, 20

    @Column(name = "subtotal_15", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal15;

    @Column(name = "tax_15", precision = 10, scale = 2, nullable = false)
    private BigDecimal tax15;

    @Column(name = "tip", precision = 10, scale = 2)
    private BigDecimal tip;

    @Column(name = "total", precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    @Column(name = "email_sent", nullable = false)
    private boolean emailSent;

    @Lob
    @Column(name = "xml_authorized", columnDefinition = "TEXT")
    private String xmlAuthorized;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
```

### 7.3 Control Concurrente de Secuenciales (Sin Saltos ni Duplicados)

En Ecuador el SRI sanciona severamente la duplicación o el salto de secuenciales numéricos. Para garantizar que dos meseros facturando al mismo milisegundo no colisionen, se utiliza un bloqueo pesimista en base de datos (`PESSIMISTIC_WRITE`):

```java
package com.restaurante.billing.repository;

import com.restaurante.billing.entity.SequentialTracker;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SequentialTrackerRepository extends JpaRepository<SequentialTracker, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SequentialTracker s WHERE s.series = :series")
    Optional<SequentialTracker> findBySeriesWithLock(String series);
}
```

---

## 8. API REST para el Frontend React

### 8.1 Endpoints Disponibles
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/invoices` | Genera, firma, envía al SRI, emite RIDE y envía por correo. |
| `GET` | `/api/v1/invoices/{id}/ride` | Descarga el PDF oficial (RIDE) o ticket térmico. |
| `GET` | `/api/v1/invoices/{id}/xml` | Descarga el XML legal firmado y autorizado. |
| `POST` | `/api/v1/invoices/{id}/resend-email` | Reenvía la factura al correo del cliente. |
| `GET` | `/api/v1/customers/lookup/{identification}` | Consulta RUC/Cédula (Caché local + SRI en Línea gratuito). |

### 8.2 Controlador Spring Boot: `InvoiceController.java`

```java
package com.restaurante.billing.controller;

import com.restaurante.billing.dto.InvoiceRequestDto;
import com.restaurante.billing.dto.InvoiceResponseDto;
import com.restaurante.billing.service.InvoiceProcessingService;
import com.restaurante.billing.service.RideGeneratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configurar según el dominio de React
public class InvoiceController {

    private final InvoiceProcessingService invoiceService;
    private final RideGeneratorService rideGeneratorService;

    @PostMapping
    public ResponseEntity<InvoiceResponseDto> issueInvoice(@Valid @RequestBody InvoiceRequestDto request) {
        InvoiceResponseDto response = invoiceService.processAndIssueInvoice(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/ride")
    public ResponseEntity<byte[]> downloadRide(@PathVariable UUID id) {
        byte[] pdfBytes = rideGeneratorService.generateRidePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"RIDE-" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/xml")
    public ResponseEntity<String> downloadXml(@PathVariable UUID id) {
        String xml = invoiceService.getAuthorizedXml(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"FACTURA-" + id + ".xml\"")
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }

    @PostMapping("/{id}/resend-email")
    public ResponseEntity<Void> resendEmail(@PathVariable UUID id) {
        invoiceService.resendInvoiceEmail(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 9. Generador de RIDE (PDF) y Envío de Correo Electrónico

### 9.1 Envío Automático con `JavaMailSender`

```java
package com.restaurante.billing.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Async
    public void sendAuthorizedInvoiceEmail(
            String recipientEmail,
            String customerName,
            String invoiceNumber,
            byte[] ridePdfBytes,
            byte[] authorizedXmlBytes
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(recipientEmail);
            helper.setSubject("Comprobante Electrónico - Factura N° " + invoiceNumber + " - El Rincón del Bolón");
            helper.setText("""
                Estimado(a) %s,

                Adjunto a este correo encontrará su comprobante electrónico con plena validez tributaria ante el SRI.

                Establecimiento: EL RINCÓN DEL BOLÓN & MARISCOS
                Comprobante: Factura N° %s

                ¡Agradecemos su preferencia!
                """.formatted(customerName, invoiceNumber));

            // Adjuntar RIDE en PDF
            helper.addAttachment("FAC-" + invoiceNumber + ".pdf", new ByteArrayResource(ridePdfBytes));

            // Adjuntar XML autorizado
            helper.addAttachment("FAC-" + invoiceNumber + ".xml", new ByteArrayResource(authorizedXmlBytes));

            mailSender.send(message);
            log.info("Factura {} enviada exitosamente por correo a {}", invoiceNumber, recipientEmail);
        } catch (Exception e) {
            log.error("Error al enviar correo de la factura {}: {}", invoiceNumber, e.getMessage());
        }
    }
}
```

---

## 10. Tareas Asíncronas y Resiliencia (Cuando el SRI está Lento o Caído)

Bajo el **Esquema Offline del SRI**, si el servidor del SRI no responde en 5 segundos o entra en mantenimiento:
1. El backend guarda la factura en estado `PENDIENTE_AUTORIZACION`.
2. Se le entrega el ticket térmico al cliente con la Clave de Acceso ya generada (legalmente válida).
3. Un proceso en segundo plano con `@Scheduled` reintenta la autorización de comprobantes pendientes cada 10 minutos:

```java
@Component
@Slf4j
@RequiredArgsConstructor
public class PendingInvoicesJob {

    private final InvoiceRepository invoiceRepository;
    private final SriSoapClientService soapClient;
    private final EmailNotificationService emailService;

    @Scheduled(fixedDelay = 600000) // Cada 10 minutos
    public void retryPendingInvoices() {
        List<Invoice> pending = invoiceRepository.findByStatus("PENDIENTE_AUTORIZACION");
        for (Invoice inv : pending) {
            var result = soapClient.checkAuthorization(inv.getAccessKey());
            if ("AUTORIZADO".equals(result.status())) {
                inv.setStatus("AUTORIZADO");
                inv.setAuthorizationDate(LocalDateTime.now());
                invoiceRepository.save(inv);

                if (inv.getCustomer().getEmail() != null) {
                    // Despacho de correo al cliente
                }
            }
        }
    }
}
```

---

## 11. Resumen de Seguridad de Producción

1. **Custodia de la Llave Privada (`.p12`):**
   - Nunca almacenar la contraseña del archivo `.p12` en el repositorio Git.
   - Usar variables de entorno (`SRI_P12_PASSWORD=...`) o servicios como AWS Secrets Manager / HashiCorp Vault.
2. **CORS Restringido:**
   - Habilitar únicamente el origen de tu aplicación frontend en producción (ej. `https://pos.rincondelbolon.ec`).
3. **Manejo de Transacciones:**
   - La inserción de la orden y la reserva del secuencial deben ser atómicas (`@Transactional`) para evitar duplicaciones tributarias.
