const fs=require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Erur = require('../models/error');
const MemerSchema = require('../models/memer-schema');
const MemesSchema = require('../models/memes-schema');

const MemesbyID = async (req, res, next) => {
  const memeid = req.params.memeid;

  let meme;
  try {
    meme = await MemesSchema.findById(memeid);
  } catch (err) {
    const error = new Erur(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!meme) {
    const error = new Erur(
      'You Get Nothing in Here',
      404
    );
    return next(error);
  }

  res.json({ meme: meme.toObject({ getters: true }) });
};

const Memesbymemer = async (req, res, next) => {
  const memerID = req.params.memerid;

  let mererswithmeme;
  try {
    mererswithmeme = await MemerSchema.findById(memerID).populate('memers');
  } catch (err) {
    const error = new Erur(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!mererswithmeme ) {
    return next(
      new Erur('Memer is shy to upload memes', 404)
    );
  }

  res.json({ meme: mererswithmeme.toObject({ getters: true }) });
};
const Getallmemes = async (req, res, next) => {
  let meme;
  try {
    meme = await MemerSchema.find();
  } catch (err) {
    const error = new Erur(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ meme: meme.map(meme => meme.toObject({ getters: true })) });
};

const createMEME = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Erur('Sorry to bother,its invalid,mind doing it again?', 422)
    );
  }

  const { caption, tags,memer} = req.body;

  
  const NewMEME = new MemesSchema({
    caption,
    tags,
    memepic:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEBIWFRUXFxYVFRUVGBcXFRUVFRUXFxUVFRUYHyggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGzIfHR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAR0AsQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAAAQIDBAUGB//EAEQQAAEDAQQGBgcECQMFAAAAAAEAAhEDITFBYQQSUZGh0RNScYGS0gUiMkJisfBTosHhFDNDcoKTwtPiBiNjFXODsuP/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAnEQEAAgEDAwQCAwEAAAAAAAAAARECAxIhBDFhE0FRgRShFUJxBf/aAAwDAQACEQMRAD8A+RwiEQEWL67xCEQixFiIIRCLEWZICEQnYixAQiEWIEICEEJlCBQhEIQJNCECQnKSihJNCBJKUoUEU0k0VJCaFpkk5QhVAhNCBITQgEJoRCKFIBJAkJwhApSKaEUkJpKAST7kIpJJoUEdYJqOompyvCxCELbIQmiEQIQmqEiE0IBCCrHC1WISZVlNSCcK0loJKyFnrPh3aFnLiLXHlOEKIqJyotBCaSAQiEQopIThKECSU0lnlbOM04ThELozZRmiM04RCUWUZpwiE4SkKEQmGqbaRNyFoBqk99pW3RvRlQkEAHIk2xgveejdJ04gBlGmBYAA9wAA/gXk6nrPRqov7p6NHp/U7zX0+bNM3BXs0d5uY49y+16BpnpUCG06XeSePRro09L9Ln3KPHyLyfy0T/X927/geXwF1F4sLHbli01pkSCF949MP9Jm2oyns9U1APugLwX+pqOkV2GnWbT9Ugh0vLmnIuyshI/6XqTtnHj/AFfwtkXf6eAarAtFf0Y9l6oNMhfQxyiYeXKK7gKSjCcLowaIShEIhwlCIRYgjKFKAhSltOAixEprbBIhOUwgUBSDQmAr6NAm4FJqE5lCmyV3fRnolzyIGzDaArPRfo0n3TuK9t6H0XV907j2rwdT1O2Kh7On6a+clnoL/TjGwXCT2L2+gaAwC4YYZhYNBJEeq7G4TsXc0St8Lty+DnllqZXk+rERjFQ20KYFwV0BVsqZHcpipkdy+hhtjHh48rtGrTBFoXjv9TehKbwbADgV7B1TI7lztPN5h2AuOE815eqrjKO8O+hfaez4h6a9FlhOsJEG2OxeY0mgMl9i9O6LrSC125fPfS/ootMgGJy2r3dH1G6Kl5+p0fh5JzQowtmk0yCbFnIX1ofM7cKoSUyktLaKFJIoK4QpyhSmrSTCE1pgKQH1YgBW02fVqMpUaROHEc11dDoHq8WeZUaNS7OPJdfQ6WY48l59TPh6dLT93R9H0nWeofFT8y9RoRdM9GbQ33qWDWt6+S4fo6mQAPVuGLvKu/omuMGYe87EA9TNfI15t9LSinZ0Ws8fsneKl5106GlP+ydh71LaPjXIoPdZ7OPvOy+HJbqNY2TEZE+VfOmOXqdilpj7JpuH8VOzc5SOnv8AsX+Kl51hp1cxx5KWudo48lY1Jjsxshpdpz/sneKn5lj0rS34UXHsdT/FyRrO+HeeSqqVnAe7vPJZmbajGnH097yZ6FwgOvdSvIsFj15X0i15s6IiSBa5mJgXFes02s+YAabCbyLo+HNef9IF5IsbY5p9o4EHq5L09PNMakXDxHpLQybdUbwuDpNMg3YAX7AAvYaZTdsbvPJcLTNHOMWgHeJX3NHU45fK19P3hxTKSvqUo3/gOSqIXqeRBCaFVV6pQnrIU4a5WQmAgBSDe3hyWnOwBnw/NaKLTgeH5qtrRnvHJaqNIYFw8PJZylcYuWrR2O6w8J2z1l2dBpPsGuPAfOubQ0ewnXfZHUxcB1c10tEpkEHpKlhm+n/bXk1J4e7TinW0J7iAQ8fy/wD6Lr0qj7xUaLv2RwAH2uS4ujUI/a1d9L+0uhQpwf1tUizGjsB+yzXz9TG3rwl1aNSp9q3+Uf7q20zUu6VuH7I4H/uLktpAxFSsOw0bd9JaadGLemrd5o/2l5csHaJdhjnY1PuR/UrA6pH6wfy/81yGUrRNarE2gmlBGwxTBjsIVxd/yVN9P+2uU4N23P6TCoP5f+apPS2zUbH/AG4/rWXWj9pUPaac8GBJ1WyNZ+9vlSMCxVD5lzwbCLGRfHxHYuTpzSPeN4FwxMK+u8ucAKj2jVc4wW2wWiLW/EsGkU9tSobZtLLYM9VejTxpzzycjTxafWO5q42ktzN0YYdy7mltFtp3/kuPpFIQDbaJvzPJfS0nj1IcitRkEyb4w2SsFRq6lcWRJFs4clhdSk3m52zBpOzJe3CXh1I5ZCEiFYWqJC6OcSr1EKcIUpq1jQpAfVqgIy4KQjLgtMStpjLiea3UWiyzbi7LPNY2aoPu4bNi1U3M+Hc1c8nTTh0tHjq3/E/bPWyXQ0VrSQNX79TzLk03U4NjMMG7QtVKpS/49zOS82cW9mMuzSa3YfHU8y0spgmfW7n1BhHWXFY6lspeFnJaWVdHx6LP2F5ssXaJdulTbNutdP6yrtPxZLSxjB1rf+Srtmz11w21dHs/VGMmGFpp6To+yj4ad+5cMsJdIydc6kXHx1TwL7exQbSb8f8AMq+dYGaVo4Id/stj3mtphwzaQJBR+k0TeKJ/hpn8FjZLW50ixvxfzKvmVR0VpJd69zQB0lWB7RJsdfduWAaNod7mUJvMhl5tuTnQ2jV/2AJmP9u+6U2/Fm5qNNomJtEH16l0g9ay0BYdNIDHEYNNpc84X2lV1dJ0YewaEgE2dHtaLu9Yq2m0ttPczkuuOEsTlCzTyA5wAEAkC03A2Yrk6S7IWCMbh3rRWrNJJhsm2dVtudyw1tUAWNmJubiSvVp4uGcslUi2wYbcdbkFkqVNkbtti1VHbI3BZnOtwuOA2GF6sXkzZXu7FWQrHO7NwUCV1cEUJyEKqmzv4qxk7DuKTaZNw4hSFM/RHNEaGdh3HktNOrHW3OWdjTsGGLdnatDWnZ95vNc5d8WqlX/e3O5LTTqOtEPuPuv2HJYQ4jDi3mrm1Ts4t5rjlDvEt7NIdsf4X8lcyu++Khw9l/ZsWBlU7OLea1M0uLNU7281yyxdIlrGllsE9ILOpUwJyzU2+lW3az5OGrUmzKFVT0qcD4mD+paOnsuGHv05xu9ZcZxh0tZS0zWIa3pJNg9SpjZiFYdIrDCruqfgFir6U4NJa22LPXp39z5UWOcfd3upj+pTYttn6dUN3TH+GobrNiiazoktqSTHsVJgCwXXWneVUXFsANmwWh9K8iT7+2VRUrmfZ+9T82SRjBbSajgZ1KgJs9h4O2Llm03SHuY5urVkgiCypFoi2xZ3VJMQBYb30wLxjrKio0gEkss/5aU/+y3GEMzkv03Sn67rKsazo9SrtOS5tTSnG7pD/C/ktDtGfsaO19Mf1IrnVAbEwBaHMIm8x6y7YxEOWVy576jg1xIeJLIkO+OcOzesVQuN2ue5y2168YHe3HvyKx1a82DPZi0jbthd8Xnzpncx2IduKVRpmYO4pOb2b280nMIs/Ec11cEUI1fqRzQhSbDaLPkpNH1YogZjjyU9X4hx5KpS1gP0QrmPN0cRks7XdnHkrWv/AHd7uSxLpjLQCerxHNXUgZFw7SszXmMN7vKptcfh3nksTDtEtTaR2s8X5KbAdrbyInYY2ZLM2r2fe5K6WSTrgSSfZdiZ/FYmJbiYX65EXXbcymKhssB7/wAlTq7HNIzDhwhTZIm1pNke1nOCzTVtDTUva1pOALrDlcmNId1fvBZKr3AE+rvdyVgrN6/3DzWdrW5YNKcfcxI9oYGPwTDi4TAFtxPGwHaq3VaeD8Be11+PGVWzSAXESIABmHXkmyIyTb4L8p1A6wQ0yYsN1hMmRdYq6lEkESwSIvOPcrRVE2uGMQDeQR+Koq1IBIINk3OH4KxaSv0iqSSRqxJj1jdPYudU0t32e0TIwJHzBQ7SKnUb4jyVYe6BYMcTi4nZmumONOeWSh9RxJ9WLBjsnmqXNdsG/vWoEmQQBAmZO0C6PiCg4CZJGO3EEfiukOGUX3ZHMOW9FS0k2Xq1zR1uBVJ7ltzKOz67kISVEx28PzTHbw/NNobnvHJFme8ckRIRi49zR+LlPWbtPhHmVZjPhyU2tHxbwP6VFifhbTIPvHw/5ZK5kdYx+7/ks0gXB3ib5Uw8fEP4m+VZmG4yag1vXd4B5keqJGs4wSJ1BFh/eWfXGx/ib5FLpRsd4m+RZqW90NdOqI9o+EeZSNXY7tlv+Syiq3Y/xMs+5aradZkEFrzMe+zD/wAak4txm1U6jZGs4kYjUAs8RSLaOBqd4bzWV7mbH972n5Uwhr24h/jb5Fnau5Y2niXWfu4TZ72xXAsDdUF0kgk6owBAHtZlVu0lh9x4uFlRuAj7NUwCSQXhtgFrSZtm3UGSVM91uPZc8iwMJxmWi4NJsh19ig+6J+7/AJKtrIM6zrjHs3kETdmVCqCATrG4nDkrSW11HUyZ9fcOao1Ztnb7tsAkW25KDqUEgudIs93DuScLAA51k9XEk7M1YhJk3CA620iJi4awJx+ELK5lwm8gXbTG1TLTb6xgCcNoGzNUmZ9q4g4YGdi1DllSB7eH5pWbTuRq5nhyUS2603A4YiVtzg7M9wQoxmeCELTb2KVmziVWGqWqtUlpED6KYPbvKjClAGHzUE9YRMcTzQKo6g3v8yGPA90d9qsD29VuOCy3fkm1m/Zt8VTzKzXbd0bcfeqbf3lX0g6rdyn0req3cpMLEpaw6jd9TzKTajeoBGx1TzqvXbsbuUm1W9Vu5SmrWGq2P1Y8VTzINdn2LPFW/uKs1GxYxvcLVSKrdjdwSicmturFtMW2+1UxtA9vYpdKAI1GxM31PNksT6gJmBhdYLBFwQwAyewYxjP4KbV3R7NMgkDVAvmC+2GuMWnIIc1pw+87mqxVAua24jHHvVdStYfVbdsSpN0L6hBJO0k3ux71SaU26zsbJTqkAkaovO1QkbBxViEmYBpX+s63POVUaV1pvA3lS1AZMYfioEBVmZhGB9Eod+V5w70i1Q1BZ2DiFthORs4u5oUNQIQs5yG4JWZcE1LXO1BGRluCesMtwRKfSm6UEmvHw7gpCoPh3N5KsuJvJKAFDldrt+Hc1Vl4wjcEBxz4qwaRUNz3nvciodP2eFvJM6RN+rZd6reSnNT4/vJirUbi8Tm4SnBc+UG17ROr3NbPyVv/AFB/Wb4WfKEO0irFr3xmXQka56x4qTEfCxM/MqnVo6u32W427M0DSjEerF/ssv3K3/qDxdUcOxzkfpbzLtdxuEycJsnv4qfR9yqFXWIa7Vi03NGBxAlT6OnkoPrHEnvlUO1claLaS1l9m9Q9TLH5qqpqyRZem0SLLVaLSLxlwUS4WCy8bNqYp4kYbMwoxjHBE5BDckjq5Jlp2HcUNpO6p3FLIiUbMk0+hd1XbihLKkB3bxTE57io9x3J27DuVKOTnuKJ7eKU5HcjuO5Eo9ft4p9J27iozkdynTYXWAFLKAf27ipw8YP3OS/RX9X5FR/R39Q7lLhrbPwnL/j3OUmU6jrmvdGwOMcFSaLuqdyiWxeDuRGg0qovbUF17XDHMJHR6mNN/hdyVDTaLMdis7juKHCZ0aoP2b8PddyUejfdqv2xqu33ZIaxxtDXHMAqwUnR7Lpm7VOA7M1LWvCI0d5vY+Bb7LthyS6J3Ud4TyTcwi9jtxUSwn3XbikSkx4S6B1/Rv7dV3JKqS0NFosNkEe8U6tN2sfVdefdKrM3QdxVsrwj0uZ4pCpaL7xtwKmGk+6dxSNN3VO4pZXhDpMzxS6Tt4qzo3dU7kjTd1ThhklrUodJ28UKXRO6pQllI9yO4pSiclUOckTklOSetkeCFDWyKRdknP1Yj6wQAORRrZJSgOyQo9bJTF0wdmCjOXyROXyRDDrrMQn0Z2cQk12SjrZHggbxFmQ+SXcn9Xjmg3fmOai0Q7NvyR3Ja2XySLskUauSYFnefwTc602fJA7OI5oEBkiEx+G0bRmo27PkgIOz5JdyZ7PkiPqxApQnB+iOaEUTkickayNbJEE5J93yRrZI1kB3fJFuz5InJMHJEIdicHZ8kT9WIk7OIQK3Z8kW7E9bJGvkgBOzEfNB7OIQDNkJkHLeEESckd3yRrZInJFHd8kpy+Sduz5I1TlvCAJy+SC66z5bSh0z+YSt2IDWyS1skTklOSin9YI+sEpyQ52SByhKckkKNNJCCSYHZvUE1RK5GtkooRKPWyRKSUqCUp/V6igKlJmcrxjmopgXXXhRRUz3b1GUkQoUYKPq8JR2ceSC3MceSFD6vCC676xKCMxx5Jav1agNZMH8Eo7EiinOSJSlEpZR6ySSFCjTUVLVQCNyRQgaFElNqWUcqUZjioJwllGhJxixIFWyjt+SfeOPJKUgoUke0ceSUqKEspId313I7xx5KBKJS1pZ3jjySJ7OPJQLkpQpKUwVDWS1lLKTLkpUdZEpa0nOSFGUJaU//9k=',///req.file.path, // => File Upload module, will be replaced with real image url
    memer
  });

  let memerexisting;
  try {
    memerexisting = await MemerSchema.findById(memer);
  }
   catch (err) {
   const error = new Erur(
      'Cannot Upload Meme ,TTYL',
      500
    );
    return next(error);
  }

  if (!memerexisting) {
   const error = new Erur('Register Yourself First Please', 404);
    return next(error);
 }

 console.log(memerexisting);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await NewMEME.save({ session: sess }); 
    memerexisting.meme.push(NewMEME); 
    await memerexisting.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new Erur(
      'Creating Meme failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ meme: NewMEME });
};

const ChangeMeme = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Erur('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { caption, tags } = req.body;
  const memeID = req.params.memeid;

  let meme;
  try {
    meme = await MemesSchema.findById(memeID);
  } catch (err) {
    const error = new Erur(
      'Sorry Cannot format the POST',
      500
    );
    return next(error);
  }

  meme.caption = caption;
  meme.tags = tags;
  meme.memepic = 'data:image/jpeg;base64,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';///req.file.path;

  try {
    await meme.save();
  } catch (err) {
    const error = new Erur(
      'Something went wrong, could not update meme.',
      500
    );
    return next(error);
  }

  res.status(200).json({ meme: meme.toObject({ getters: true }) });
};

const MEMEBEGONE = async (req, res, next) => {
  const memeID = req.params.memeid;

  let memetogo;
  try {
    memetogo = await MemesSchema.findById(memeID).populate('memes');
  } catch (err) {
    const error = new Erur(
      'Something went wrong, could not delete meme.',
      500
    );
    return next(error);
  }

  if (!memetogo) {
    const error = new Erur('Could not find meme for this id.', 404);
    return next(error);
  }
  console.log(memetogo);
 /// const imagePath = memetogo.Meme;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();   
    await memetogo.remove({session: sess});
    memetogo.memer.meme.pull(memetogo); 
    console.log('ssj');
    await memetogo.memer.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new Erur(
      'Something went wrong, could not delete meme.',
      500
    );
    return next(error);
  }
 /// fs.unlink(imagePath,err=>{
  //  console.log(err);
 /// })
  res.status(200).json({ message: 'Deleted meme.' });
};

exports.Memesbymemer = Memesbymemer;/////checked
exports.MemesbyID = MemesbyID;///checked
exports.createMEME = createMEME;///checked
exports.ChangeMeme = ChangeMeme; ///checked
exports.MEMEBEGONE = MEMEBEGONE;///checked
exports.Getallmemes = Getallmemes;///checked
