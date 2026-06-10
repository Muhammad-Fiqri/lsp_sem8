import "./stylesheet/Login.css" //mengimport file CSS untuk tampilan
import {useRef, useState} from "react" //mengimport hooks React useState untuk membuat state dan useRef untuk membuat Reference

export default function Login() { //deklarasi fungsi react component halaman Login
  const usernameRef = useRef(null); //deklarasi referensi username dan password (referensi dalam react ketika berubah tak akan mereload component)
  const passwordRef = useRef(null);
  const [username, setUsername] = useState(""); //deklarasi state username dan password (state dalam react ketika berubah akan mereload component)
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); //deklarasi state mode (jika mode berubah ke Signup, halaman akan berubah ke mode signup)

  const handleLogin = (formData) => { // fungsi ini berguna untuk menghandle logika http request POST login
    const usernameInput = formData.get("username"); // ambil input login username dan password dari object formData
    const passwordInput = formData.get("password");

    setUsername(usernameInput); // simpan username dan password ke state agar data tetap tersimpan ketika component di reload sehingga input di form tidak hilang
    setPassword(passwordInput); // setelah state di set component di reload

    const response = fetch("http://localhost:3000/api/auth/login", { // response akan menyimpan respon dari http respon ke API gateway login
      method: "POST", //deklarasi method http Request, POST karena mengirim data
      headers: { //deklarasi headers, isi dari konten apa? yaitu JSON
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ //deklarasi isi JSON yaitu username dan password dari form lalu di stringify atau di ubah jadi teks agar dapat di kirim lewat API
        username,
        password
      })
    }).then(res => res.json()) // jika ada respon ubah kembali menjadi JSON
    .then(data => { //jik ada object data dari respon maka keluarkan pesan dari data lewat alert
      alert(data.message);

      if (data.success) {
        sessionStorage.setItem("jwt", data.jwt); //jika data attribute success true maka artinya login berhasil, maka akan ada JWT untuk verifikasi, simpan pada sessionStorage lalu jika role admin pindah ke route /dashboard, jika role manager pindah ke route /laporan

        if(data.role == 'admin'){
          window.location.href = "/dashboard";
        } else if (data.role == 'manager'){
          window.location.href = "/laporan";
        }

      }
    });
  }

  const handleSignup = (formData) => { // fungsi ini berguna untuk menghandle logika singup
    const usernameInput = formData.get("username");
    const passwordInput = formData.get("password");

    setUsername(usernameInput);
    setPassword(passwordInput); // sama seperti handle Login, menyimpan form input ke state


     const response = fetch("http://localhost:3000/api/auth/signup", { // mengirim http respon post seperti handle Login hanya saja API Endpoint signup
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(data => {
      if (data.success) { // bedanya dengan HandleLogin adalah tak ada JWT yang diterima dan alertnya adalah permintaan menunggu database admin approval
        alert("Signup successful! Please wait for database admin approval.");
      } else {
        alert(data.message);
      }
    });
  }

  return (
    <div className="login"> {/* berikut adalah rangkaian HTML yang berisi div untuk teks logo di kiri dan login form di kanan */}
        <div className="text-logo">
          <h1>
            PT JeWePe<br></br>Steel
          </h1>
          <img src="/public/Logo.svg" alt="logo" />
        </div>
        <div className="login-card">
          <h1>{mode === "login" ? "Log in" : "Sign up"}</h1> {/* Header 1 serta deskripsi berubah sesuai state login */}
          <span>{mode === "login" ? "New Admin? " : "Already an Admin?"} <a href="#" onClick={(e) => {
            e.preventDefault();
            setMode(mode === "login" ? "signup" : "login");
          }}>{mode === "login" ? "Sign up (Require Database Admin Approval)" : " Log in"}</a></span>
          <form action={mode === "login" ? handleLogin : handleSignup}>
            <label htmlFor="username">Username</label>
            <input ref={usernameRef} value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Enter your username" />

            <label htmlFor="password">Password</label>
            <input ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter your password" />

            <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
          </form>
        </div>
    </div>
  )
}