import "./stylesheet/PersediaanBarang.css";

export default function PersediaanBarang() {
  return (
    <div className="PersediaanBarang">
      <div className="PersediaanBarang__grid">
        <section className="PersediaanBarang__card">
          <h2 className="PersediaanBarang__cardTitle">Input Barang Masuk</h2>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="masuk-id">
              ID Barang
            </label>
            <input
              id="masuk-id"
              className="PersediaanBarang__input"
              type="text"
              placeholder="Masukan ID Barang Yang Masuk"
            />
          </div>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="masuk-nama">
              Nama Barang
            </label>
            <input
              id="masuk-nama"
              className="PersediaanBarang__input"
              type="text"
              placeholder="Nama Barang Dari ID Akan Muncul Disini"
            />
          </div>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="masuk-stok">
              Stok
            </label>
            <input
              id="masuk-stok"
              className="PersediaanBarang__input"
              type="number"
              placeholder="Masukan Stok Barang Yang Masuk"
            />
          </div>
          <button className="PersediaanBarang__button" type="button">
            Submit
          </button>
        </section>

        <section className="PersediaanBarang__card">
          <h2 className="PersediaanBarang__cardTitle">Input Barang Keluar</h2>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="keluar-id">
              ID Barang
            </label>
            <input
              id="keluar-id"
              className="PersediaanBarang__input"
              type="text"
              placeholder="Masukan ID Barang Yang Keluar"
            />
          </div>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="keluar-nama">
              Nama Barang
            </label>
            <input
              id="keluar-nama"
              className="PersediaanBarang__input"
              type="text"
              placeholder="Nama Barang Dari ID Akan Muncul Disini"
            />
          </div>
          <div className="PersediaanBarang__field">
            <label className="PersediaanBarang__label" htmlFor="keluar-stok">
              Stok
            </label>
            <input
              id="keluar-stok"
              className="PersediaanBarang__input"
              type="number"
              placeholder="Masukan Stok Barang Yang Keluar"
            />
          </div>
          <button className="PersediaanBarang__button" type="button">
            Submit
          </button>
        </section>
      </div>

      <section className="PersediaanBarang__tableCard">
        <h2 className="PersediaanBarang__sectionHeader">Total Barang</h2>
        <table className="PersediaanBarang__table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Batu Bata Batako</td>
              <td>0</td>
              <td className="PersediaanBarang__status PersediaanBarang__status--unavailable">
                Tidak Tersedia
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Pipa Paralon</td>
              <td>0</td>
              <td className="PersediaanBarang__status PersediaanBarang__status--available">
                Tersedia
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
