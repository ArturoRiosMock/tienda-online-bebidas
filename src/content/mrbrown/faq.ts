export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: '¿Debo registrarme para comprar en línea?',
    answer:
      'No es necesario registrarte. Puedes completar tu compra directamente ingresando tus datos en el checkout. Si deseas una experiencia más rápida y llevar control de tus pedidos, te recomendamos crear una cuenta y/o suscribirte a nuestro newsletter.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjetas de crédito, débito y pagos procesados de manera segura a través de nuestra plataforma en línea. Por seguridad, no manejamos pagos en efectivo ni terminales bancarias al momento de la entrega.',
  },
  {
    question: '¿Puedo pagar al recibir mi pedido?',
    answer:
      'No. Todos los pagos deben completarse en línea antes de procesar tu orden.',
  },
  {
    question: '¿Puedo modificar o cancelar mi pedido una vez realizado?',
    answer:
      'No es posible editar los productos después de generar el pedido. Si detectas un error en la dirección o correo electrónico, contáctanos de inmediato en hola@mrbrown.com.mx con tu número de pedido. Si la orden ya está en preparación, en ruta o entregada, no podrán realizarse cambios ni reembolsos.',
  },
  {
    question: '¿Cuál es el área de entrega?',
    answer:
      'Entregamos en: Ciudad de México, algunas zonas del Estado de México y Valle de Bravo (con frecuencia y horarios distintos). Si tienes dudas sobre tu ubicación, puedes escribirnos para confirmarla.',
  },
  {
    question: '¿Cuánto tarda la entrega?',
    answer:
      'Nuestro tiempo estimado es de 24 a 48 horas hábiles. En Valle de Bravo, los tiempos pueden variar ligeramente dependiendo de la disponibilidad logística.',
  },
  {
    question: '¿Cómo puedo confirmar y seguir mi pedido?',
    answer:
      'Al realizar tu pago recibirás un correo con un enlace para rastrear el estatus de tu entrega en tiempo real.',
  },
  {
    question: '¿Venden sólo a mayores de edad?',
    answer:
      'Sí. La venta de alcohol es exclusivamente para mayores de 18 años. En algunas entregas podremos solicitar identificación oficial a la persona que recibe el pedido.',
  },
  {
    question: '¿Qué pasa si no estoy en casa cuando llegue mi pedido?',
    answer:
      'Realizamos un intento de entrega. Si no es posible concretarlo, nos pondremos en contacto contigo para reprogramar. En caso de necesitar un reenvío a una nueva dirección, podría generar un costo adicional.',
  },
];
