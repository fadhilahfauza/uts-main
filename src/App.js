import React, { useState, useEffect } from "react";
import "./style/main.css";
import { GiShoppingBag } from "react-icons/gi";
import RatingStars from "./components/RatingStars";
import ShoppingCart from "./components/ShoppingCart";

const products = [
  {
    id: 1,
    name: "Melon",
    rating: 4.2,
    description:
      "Melon mengandung antioksidan seperti beta-karoten dan likopen, yang dapat membantu melindungi sel-sel tubuh dari kerusakan akibat radikal bebas.",
    price: 18000,
    image: require("./assets/images/melon.png"),
  },
  {
    id: 2,
    name: "Semangka",
    rating: 4.2,
    description:
      " mengandung asam amino arginin, yang dapat membantu meningkatkan produksi oksida nitrat dalam tubuh.",
    price: 10000,
    image: require("./assets/images/semangka.png"),
  },
  {
    id: 3,
    name: "Kelengkeng",
    rating: 3.2,
    description:
      "Kandungan zat besi dalam buah kelengkeng bermanfaat untuk memproduksi sel darah merah sehingga kamu bisa terhindar dari anemia",
    price: 22000,
    image: require("./assets/images/kelengkeng.png"),
  },
  {
    id: 4,
    name: "Anggur",
    rating: 4.8,
    description:
      "Anggur mengandung senyawa antosianin yang memiliki sifat antimikroba. Kandungan tersebut mampu merusak dinding sel bakteri.",
    price: 30000,
    image: require("./assets/images/anggur.png"),
  },
  {
    id: 5,
    name: "Mangga",
    rating: 4.5,
    description:
      "Phasellus condimentum, ante et dictum placerat, nulla ipsum commodo lorem, ut mollis nibh turpis a metus.",
    price: 15000,
    image: require("./assets/images/mangga.png"),
  },
  {
    id: 6,
    name: "Durian",
    rating: 4.8,
    description:
      " Buah mangga adalah sumber yang kaya akan vitamin C, nutrisi penting yang berperan dalam memperkuat sistem kekebalan tubuh",
    price: 100000,
    image: require("./assets/images/durian.png"),
  },
  {
    id: 7,
    name: "Leci",
    rating: 4.8,
    description:
      " Leci kaya akan jenis antioksidan yang disebut polifenol. Zat ini kerap digunakan dalam pengobatan tradisional untuk melindungi dan memperkuat hati dan pankreas.",
    price: 26000,
    image: require("./assets/images/leci.png"),
  },
  {
    id: 8,
    name: "Rambutan",
    rating: 4.8,
    description:
      " Rambutan kaya akan antioksidan yang melawan radikal bebas dan mencegah penyakit yang mungkin ditimbulkannya. Penyakit tersebut termasuk kanker, peradangan, dan bahkan jantung. ",
    price: 15000,
    image: require("./assets/images/rambutan.png"),
  },
  {
    id: 9,
    name: "Jeruk",
    rating: 4.8,
    description:
      " Serat makanan yang tinggi dalam buah jeruk mempromosikan pencernaan yang sehat dan membantu mencegah sembelit. Dengan mengonsumsi buah jeruk secara teratur,dapat meningkatkan kesehatan saluran pencernaan tubuh",
    price: 23000,
    image: require("./assets/images/jeruk.png"),
  },
  {
    id: 10,
    name: "Apel",
    rating: 4.8,
    description:
      " Apel mengandung vitamin C yang tinggi, nutrisi penting untuk meningkatkan sistem kekebalan tubuh. Dengan rutin mengonsumsi apel, Anda dapat membantu tubuh melawan infeksi dan penyakit. ",
    price: 28000,
    image: require("./assets/images/apel.png"),
  },
  {
    id: 11,
    name: "Salak",
    rating: 4.8,
    description:
      " manfaat buah salak yang penting untuk diketahui di antaranya adalah baik untuk menjaga kesehatan mata. ",
    price: 10000,
    image: require("./assets/images/salak.png"),
  },
];

function App() {
  const [cartsVisibilty, setCartVisible] = useState(false);
  const [productsInCart, setProducts] = useState(
    JSON.parse(localStorage.getItem("shopping-cart")) || []
  );
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(productsInCart));
  }, [productsInCart]);
  const addProductToCart = (product) => {
    const newProduct = {
      ...product,
      count: 1,
    };
    setProducts([...productsInCart, newProduct]);
  };

  const onQuantityChange = (productId, count) => {
    setProducts((oldState) => {
      const productsIndex = oldState.findIndex((item) => item.id === productId);
      if (productsIndex !== -1) {
        oldState[productsIndex].count = count;
      }
      return [...oldState];
    });
  };

  const onProductRemove = (product) => {
    setProducts((oldState) => {
      const productsIndex = oldState.findIndex(
        (item) => item.id === product.id
      );
      if (productsIndex !== -1) {
        oldState.splice(productsIndex, 1);
      }
      return [...oldState];
    });
  };

  return (
    <div className="App">
      <ShoppingCart
        visibilty={cartsVisibilty}
        products={productsInCart}
        onClose={() => setCartVisible(false)}
        onQuantityChange={onQuantityChange}
        onProductRemove={onProductRemove}
      />
      <div className="navbar">
        <h3 className="logo">Fresh fruit</h3>
        <button
          className="btn shopping-cart-btn"
          onClick={() => setCartVisible(true)}
        >
          <GiShoppingBag size={24} />
          {productsInCart.length > 0 && (
            <span className="product-count">{productsInCart.length}</span>
          )}
        </button>
      </div>
      <main>
        <h2 className="title">Produk</h2>
        <div className="products">
          {products.map((product) => (
            <div className="product" key={product.id}>
              <img
                className="product-image"
                src={product.image}
                alt={product.image}
              />
              <h4 className="product-name">{product.name}</h4>
              <RatingStars rating={product.rating} />
              <p>{product.description}</p>
              <span className="product-price">Rp.{product.price}</span>
              <div className="buttons">
                <button className="btn">Detail</button>
                <button
                  className="btn"
                  onClick={() => addProductToCart(product)}
                >
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
