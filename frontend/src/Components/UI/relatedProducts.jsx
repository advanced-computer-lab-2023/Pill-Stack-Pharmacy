import { Link } from "react-router-dom";
import { Buffer } from 'buffer';

function RelatedProduct({relatedMed}) {
    
    console.log("hello",relatedMed);
    
  return (
    <Link to={`/medicine/details/${relatedMed._id}`} href="!#" replace>
      <div className="card shadow-sm">
        <img
          className="card-img-top bg-dark cover"
          height="200"
          src={`data:${relatedMed.Image.contentType};base64, ${Buffer.from(
            relatedMed.Image.data
          ).toString('base64')}`}
          alt={relatedMed.Name}
        />
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {relatedMed.Name}
          </h5>
          <p className="card-text text-center text-muted">{relatedMed.Price}</p>

        </div>
      </div>
    </Link>
  );
}

export default RelatedProduct;