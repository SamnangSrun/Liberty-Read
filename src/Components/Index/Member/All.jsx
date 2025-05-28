import React from "react";
import CardMember from "./CardMember";

const AllCardMember = () => {
  return (
    <section>
         <div className="flex justify-center gap-8">
     
     <CardMember
       imageUrl="https://i.pinimg.com/736x/13/43/6a/13436aea0bd8743a8ed342802b7fa234.jpg"
       name="Leapheng Sreng"
       role="FullStack Developer "
      
      
     />
  
     <CardMember
       imageUrl="https://i.pinimg.com/736x/13/43/6a/13436aea0bd8743a8ed342802b7fa234.jpg"
       name="Srun Samnang"
       role="FullStack Developer "
      
      
     />
     <CardMember
       imageUrl="https://i.pinimg.com/736x/13/43/6a/13436aea0bd8743a8ed342802b7fa234.jpg"
       name="Sovann Sothearith"
       role="UX/UI Designer "
      
      
     />
    
   </div>

    </section>
   
  );
};

export default AllCardMember;
