import {useState} from 'react';
import axios from 'axios';

import './assets/style.css';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: 'ricky600900@gmail.com',
    password: '',
  });
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState();

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response);
    }
  };

  const onsubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const {token, expired} = response.data;
      // 設定 Cookie
      document.cookie = `rickyToken=${token};expires=${new Date(expired)};`;
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common['Authorization'] = token;
      // 取得產品資料所在處
      getProducts();

      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);

      console.log(error.response);
    }
  };

  const checkLogin = async () => {
    try {
      // 讀取 Cookie
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('rickyToken='))
        ?.split('=')[1];

      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common['Authorization'] = token;

      const response = await axios.post(`${API_BASE}/api/user/check`);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };
  return (
    <>
      {!isAuth ? (
        <div className="container">
          {/* 登入區塊 */}
          <div className="row align-items-center">
            <div className="col">
              <h1 className="text-center fw-bold">請先登入</h1>
              <form className="from-floating" onSubmit={(e) => onsubmit(e)}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={(e) => handleInputChange(e)}
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange(e)}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  登入
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          {/* 產品列表 */}
          <div className="row mt-5">
            <div className="col-md-6">
              {/* 功能按鈕 */}
              <button
                className="btn btn-danger mb-5"
                type="button"
                onClick={() => checkLogin()}
              >
                確認是否登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? '啟用' : '未啟用'}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-body">
              <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <div className="card mb-3">
                    <img
                      src={tempProduct.imageUrl}
                      className="card-img-top primary-image"
                      alt="主圖"
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {tempProduct.title}
                        <span className="badge bg-primary ms-2">
                          {tempProduct.category}
                        </span>
                      </h5>
                      <p className="card-text">
                        商品描述：{tempProduct.description}
                      </p>
                      <p className="card-text">
                        商品內容：{tempProduct.content}
                      </p>
                      <div className="d-flex">
                        <p className="card-text text-secondary">
                          <del>{tempProduct.origin_price}</del>
                        </p>
                        元 / {tempProduct.price} 元
                      </div>
                      <h5 className="card-title fw-bold ">更多圖片</h5>
                      <div className="d-flex flex-wrap">
                        {tempProduct.imagesUrl?.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            className="images"
                            style={{height: '100px', marginRight: '5px'}}
                            alt="副圖"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
