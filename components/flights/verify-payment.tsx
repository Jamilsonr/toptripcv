export function VerifyPayment({
  result: { hasCompletedPayment },
}: {
  result: {
    hasCompletedPayment: boolean;
  };
}) {
  return (
    <div>
      {hasCompletedPayment
        ? "O pagamento foi verificado!"
        : "Não foi possível verificar o pagamento. Tenta novamente!"}
    </div>
  );
}
