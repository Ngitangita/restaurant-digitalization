import React from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import BonDeCommande from '../../components/bonDeCommande/BonDeCommande';

export default function BonDeCommandes() {



  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px] pb-5">
      <Breadcrumb pageName="Bon De Commande"/>

      <div className='bg-white p-5 pb-10'>
        <BonDeCommande />
      </div>
    </div>
  );
}
