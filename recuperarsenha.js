function recuperarSenha() {
    const email = document.getElementById("email").value;
    const userEmail = localStorage.getItem("userEmail");
  
    if (email === userEmail) {
      alert("📩 Um link de redefinição de senha foi enviado para seu email!");
      window.location.href = "index.html"; // volta para login
    } else {
      alert("⚠️ Nenhuma conta encontrada com esse email.");
    }
  
    return false; // Evita reload do form
  }
  