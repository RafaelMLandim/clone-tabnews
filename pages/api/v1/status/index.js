function status(request, response) {
  response.status(200).json({ chave: "bateu no endpoint parabens" });
}

export default status;
