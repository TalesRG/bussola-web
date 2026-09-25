import { StepHeader } from "../_components/step";
import { ReceiptUpload } from "./receipt-upload";

// A01b · Enviar comprovante de matrícula
export default function Comprovante() {
  return (
    <>
      <StepHeader
        backHref="/agenda/montar"
        label="Passo 1 de 4"
      />
      <ReceiptUpload />
    </>
  );
}
