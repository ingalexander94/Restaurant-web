import React from "react";
import PropTypes from "prop-types";
import { formatDate, formatNumber } from "../../helpers/pipes";

const TableItem = ({ sale, index }) => {
  return (
    <>
      <tr>
        <th scope="row" className="align-middle">
          {index + 1}
        </th>
        <td className="align-middle">{sale.nameClient}</td>
        <td className="align-middle">
          {sale.order.map((order) => (
            <div key={order.id} title={formatNumber(order.price)}>
              {order.name} <small>x{order.quantity}</small>
              <br />
            </div>
          ))}
        </td>
        <td className="align-middle">{formatDate(sale.create)}</td>
        <td className="align-middle">{sale.timer}</td>
        <td className="align-middle">{formatNumber(sale.total)}</td>
      </tr>
    </>
  );
};

TableItem.propTypes = {
  sale: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default TableItem;
