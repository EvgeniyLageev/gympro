
/* ------- begin view -------- */
function ModuleView() {
  let myModuleContainer = null;
  let menu = null;
  let contentContainer = null;

  //компоненты SPA
  const MainComponent = {
    id: "main",
    title: "About app",
    render: (className = "container") => {
      return `
          <section class="${className}">
            <h1>О приложение</h1>
            <p>Здравствуйте</p>
            <p>Во вкладке <strong>EXERCISES</strong> содержаться около 1400 видов различных упражнений.
            Вы можете отфильтровать их по 4 параметрам: (как по одному, так и по всем сразу). Каждое упражнение
            можно удалить или пометить. Для этого нужно быть зарегистрированным</p>
            <p>Во вкладке <strong>START</strong> вы можете выбрать любое из отмеченных вами упражнений и начать заниматься.
            в открывшемся окне нужно ввести вес и подходы</p>
            <p>Во вкладке <strong>HISTORY</strong> вы можете выбрать любое из упражнений, по который вы уже занимались и, 
            в ближайшем будущем, вы сможете посмотреть свою статистику</p>
            <p>Важно отметить, что у каждого зарегистированного пользователя своя база упражнений</p>
          </section>
        `;
    }
  };

  const ExercisComponent = {
    id: "exercis",
    title: "Exersices",
    render: (className = "container") => {
      return `<h1>EXERCISES BASE</h1>
              <div id="wrapperInput" class="wrapperInput">
              <input class="name__input" type="text" name="name" placeholder="введите название упражнения">
              <div class="div__select">
                <select class="selectExersices" id="bodyPartList" name="bodyParts" id=""></select>
                <select class="selectExersices" id="targetList" name="target" id=""></select>
                <select class="selectExersices" id="equipmentList" name="equipment" id=""></select>
              </div>
              <button class="btnSearch" id="btnSearch">search</button>
            </div>
        `;
    }
  };

  const StartComponent = {
    id: "start",
    title: "Start",
    render: (className = "container") => {
      if (auth.currentUser) {
        return `
          <section class="${className}">
          <h1>START EXERCISES</h1>
          <select class="selectExersices" id="chekedExercises" name="chekedExercises"></select>
          <button class="btnSearch startTrening" id="startTrening">Start Trening</button>
          </section>
        `;
      } else {
        return `
          <section class="${className}">
            <h1>Нет выбранного пользователя</h1>
            <p>Для того, что бы пользоваться этим разделом, вам нужно либо зарегистрироваться, 
            либо войти в свою учетную запись. 
            <span id="login__link">Вход/Регистрация</span>.</p>
          </section>
        `;
      }
    }
  };

  const HistoryComponent = {
    id: "history",
    title: "History and Progress",
    render: (className = "container") => {
      if (auth.currentUser) {
        return `
        <section class="${className}">
        <h1>YOUR PROGRESS</h1>
        <select class="selectExersices" id="selCheckProgress" name="selCheck"></select>
        <button class="btnSearch checkProgress" id="btnCheckProgress">Check your progress</button>
        </section>
        `;
      } else {
        return `
          <section class="${className}">
            <h1>Нет выбранного пользователя</h1>
            <p>Для того, что бы пользоваться этим разделом, вам нужно либо зарегистрироваться, 
            либо войти в свою учетную запись. 
            <span id="login__link">Вход/Регистрация</span>.</p>
          </section>
        `;
      }
    }
  };

  const ErrorComponent = {
    id: "error",
    title: "Error 404",
    render: (className = "container") => {
      return `
          <section class="${className}">
            <h1>Ошибка 404</h1>
            <p>Страница не найдена, попробуйте вернуться на <a href="#main">главную</a>.</p>
          </section>
        `;
    }
  };


  const router = {
    main: MainComponent,
    exercis: ExercisComponent,
    start: StartComponent,
    history: HistoryComponent,
    error: ErrorComponent
  };

  this.init = function () {
    menu = document.querySelector("#navmenu");
    contentContainer = document.querySelector("#content");
  }
  //обновление ин-фы и подсвечивание кнопки
  this.updateButtons = function (currentPage) {
    const menuLinks = menu.querySelectorAll(".navmenu__link");
    const state = `#${currentPage}`;

    for (let link of menuLinks) {
      state === link.getAttribute("href") ? link.classList.add("active") : link.classList.remove("active");
    }
  }
  //заполнение страницы
  this.renderContent = function (hashPageName) {
    let routeName = "default";

    if (hashPageName.length > 0) {
      routeName = hashPageName in router ? hashPageName : "error";
    }

    window.document.title = router[routeName].title;
    contentContainer.innerHTML = router[routeName].render(`${routeName}-page`);
    this.updateButtons(router[routeName].id);

  }
  //заполнение инпутов
  this.fillInputs = function (data2, data, sel) {
    let option = document.createElement("option")
    option.text = "All " + `${data2}`;
    sel.add(option)

    for (let i = 0; i < data.length; i++) {
      let option = document.createElement("option")
      option.text = `${data[i]}`;
      sel.add(option)
    }
  }
  //заполнение инпутов
  this.fillInputsStart = function (sel, data) {

    let option = document.createElement("option")
    option.setAttribute("hidden", "true");
    option.text = "Choose Exercis";
    sel.add(option);

    let arrData = Object.values(data)

    arrData.forEach(function (v) {
      let option = document.createElement("option")
      option.setAttribute("data-id", `${v.id}`);
      option.text = `${v.name}`;
      sel.add(option)
    })
  }
  //заполнение инпутов
  this.fillInputsHistory = function (select, arr) {

    let option = document.createElement("option");
    option.setAttribute("hidden", "true");
    option.text = "Choose Exercis";
    let SL = document.getElementById("selCheckProgress")
    SL.add(option);

    for (let i = 0; i < arr.length; i++) {
      let option = document.createElement("option")
      option.text = `${arr[i]}`;
      SL.add(option)
    }

    // console.log(select)
  }

  //очищаем поле от предыдущего вывода упражнений
  this.clearDataExercises = function () {
    let elem = document.getElementById("div__wrapper")
    if (elem) {
      elem.remove()
    }
  }

  //выводим на экран упражнения по заданным параметрам
  this.printExercisList = function (exercises, myModuleContainer, target, bodyPart, equipment, input) {

    const divWrapper = document.createElement("div")
    divWrapper.classList.add("div__wrapper")
    divWrapper.id = "div__wrapper"
    myModuleContainer.append(divWrapper)

    exercises.forEach(function (v) {
      if (((v.name).includes(input.toLowerCase())) &&
        ((v.target).includes(target == "All targetList" ? "" : target) &&
          ((v.bodyPart).includes(bodyPart == "All bodyPartList" ? "" : bodyPart) &&
            ((v.equipment).includes(equipment == "All equipmentList" ? "" : equipment))))) {

        let div = document.createElement("div")
        div.classList.add("wrapper__input");
        div.id = "wrapper__input";
        div.setAttribute("data-id", `${v.id}`)
        div.setAttribute("data-cheked", `${v.cheked === true ? "true" : "false"}`)
        divWrapper.append(div)
        div.innerHTML = `<div><img class="gifUrl" src=${v.gifUrl} alt=""></div>
      <div class="key__list">
        <p class="key">name:</p>
        <p class="key">bodyPart:</p>
        <p class="key">equipment:</p>
        <p class="key">target:</p>
      </div>
      <div class="value__list">
        <p class="value">${v.name}</p>
        <p class="value">${v.bodyPart}</p>
        <p class="value">${v.equipment}</p>
        <p class="value">${v.target}</p>
      </div>
      <img class="exercisLink" id="exercisCheck" src=${v.cheked === true ? "images/check(orange).png" : "images/check(blue).png"} alt="">
      <img class="exercisLink" id="exercisDelete" src="images/delete(blue).png" alt="">
`;
      }
    });
  }

  this.errorLogin = function (errorCode, errorMessage) {
    document.getElementById("errorMesage").innerHTML = `"Произошла ошибка:" ${errorCode}, ${errorMessage}`
  }

  this.clearLoginForm = function () {
    document.getElementById("email_input").value = "";
    document.getElementById("password_input").value = ""
  }

  this.closeModalWindow = function () {
    document.getElementById("modal").innerHTML = ""
  }

  this.updateSignIn = function (email) {
    console.log("updateSignIn")
    if (email) {
      document.getElementById("login__word").innerHTML = email;
      document.querySelector(".login__svg").classList.add("svg_signIn")
      console.log("updateSignIn, юзер есть -" + email)
    } else {
      document.querySelector(".login__word").innerHTML = "Sign In";
      document.querySelector(".login__svg").classList.remove("svg_signIn")
      console.log("updateSignIn, юзера нет -")
    }
  }
  //показываем графики
  this.showGraph = function (myModuleContainer, name, date) {


    let divWrapper = document.createElement("div")
    divWrapper.classList.add("div__wrapper2")
    divWrapper.id = "div__wrapper"
    myModuleContainer.append(divWrapper)

    let h2 = document.createElement("h2")
    h2.innerHTML = `${name}`
    divWrapper.append(h2)

    for (let i = 0; i < date.length; i++) {
      let divAttempt = document.createElement("div")
      let h3 = document.createElement("h3")
      h3.innerHTML = `${date[i]} "- это дата в миллисекундах))"`

      let p = document.createElement("p")
      p.innerHTML = "Здесь был бы график, если бы я успел))).</br> Вы сделали ___ повторов с весом___."

      h2.after(divAttempt)
      divAttempt.prepend(h3)
      h3.after(p)
    }


  }

  //модальное окно для входа
  this.openModalLogin = function () {
    document.querySelector(".modal").innerHTML = `<a class="background" id="background"></a>
                                        <div class="app-title">
                                                            <h1>Login</h1>
                                                            
                                            <div class="login-form">
                                                      <div class="control-group">
                                                            <input type="text" class="login-field email_input" id="email_input" value="" placeholder="username">
                                                            <label class="login-field-icon fui-user" for="email_input"></label>
                                                      </div>
                                                      <div class="control-group">
                                                            <input type="password" class="login-field password_input" id="password_input" value="" placeholder="password">
                                                            <label class="login-field-icon fui-lock" for="password_input"></label>
                                                      </div>
                                                            <btn class="btn" id="btn-login">login</btn>
                                                            <btn class="btn" id="btn-registr">registration</btn>
                                                            <p id="errorMesage"></p>
                                             </div> 
                                        </div> 
                                        `
  }
  //открытие модального окна с тренировкой
  this.openModalStart = function (data) {
    document.querySelector(".modal").innerHTML = `<a class="background" id="background"></a>
                                                    <form class="repsWrapper">
                                                            <p>"${Object.values(data)[0].name}"</p>
                                                            <img class="imageGif" src="${Object.values(data)[0].gifUrl}" alt="">
                                                      <div class="minRepsWrapper" id="minRepsWrapper" data-id="${Object.values(data)[0].id}" data-name="${Object.values(data)[0].name}">
                                                             

                                                        <div class="repsInputWrapper" id="firstRep">
                                                            <input type="number" class="repsInput weithExercis" id="firstRepWeight" value="" placeholder="weight, kg">
                                                            <p>X</p>
                                                            <input type="number" class="repsInput repsExercis" id="firstRepExercis" value="" placeholder="reps">
                                                            <img class="repsLink" id="firstRepsCheck" src="images/check(blue).png" alt="">
                                                        </div>

                                                        <div class="repsInputWrapper" id="secondRep">
                                                            <input type="number" class="repsInput weithExercis" id="secondRepWeight" value="" placeholder="weight, kg">
                                                            <p>X</p>
                                                            <input type="number" class="repsInput repsExercis" id="secondRepExercis" value="" placeholder="reps">
                                                            <img class="repsLink" id="secondRepsCheck" src="images/check(blue).png" alt="">
                                                        </div>

                                                        <div class="repsInputWrapper" id="thirdRep">
                                                            <input type="number" class="repsInput weithExercis" id="thirdRepWeight" value="" placeholder="weight, kg">
                                                            <p>X</p>
                                                            <input type="number" class="repsInput repsExercis" id="thirdRepExercis" value="" placeholder="reps">
                                                            <img class="repsLink" id="thirdRepsCheck" src="images/check(blue).png" alt="">
                                                        </div>

                                                        <div class="repsInputWrapper" id="fourRep">
                                                            <input type="number" class="repsInput weithExercis" id="fourRepWeight" value="" placeholder="weight, kg">
                                                            <p>X</p>
                                                            <input type="number" class="repsInput repsExercis" id="fourRepExercis" value="" placeholder="reps">
                                                            <img class="repsLink" id="fourRepsCheck" src="images/check(blue).png" alt="">
                                                        </div>

                                                            <button class="btn" id="endExercis">End Exercis</button>
                                                      </div> 
                                                   </form>`
  }

  //модальное окно для выхода
  this.openModalQuit = function (user) {
    console.log("openModalQuit - " + user, user.email)
    document.getElementById("modal").innerHTML = `<a class="background" id="background"></a>
                                                    <div class="app-title">
                                                    <h1>Log Out</h1>
                                                    <p>${user.email}</p>
                                                    <btn class="btn" id="btn-signOut">Sign Out</btn>
                                                    <p id="errorMesage"></p>
                                                  </div>`
  }

};
/* -------- end view --------- */

/* ------- begin model ------- */
function ModuleModel() {
  let myModuleView = null;

  this.init = function (view) {
    myModuleView = view;
  }

  this.updateState = function (hashPageName) {
    myModuleView.renderContent(hashPageName);
  }
  //собираем инфу из БД для инпутов
  this.fillInputsBd = function (url) {

    for (let select of url) {
      myAppDB.ref(select.getAttribute("id")).once("value").then(function (snapshot) {
        const sel = document.getElementById(select.getAttribute("id"))
        const data = snapshot.val()
        const data2 = select.getAttribute("id")
        myModuleView.fillInputs(data2, data, sel);
      }).catch(function (error) {
        console.log("Ошибка запонение инпутов старт");
        console.log("Error: " + error.code);
      });
    }
  }
  //собираем инфу из БД для инпутов
  this.prepareFillInputsStart = function (sel) {

    myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").orderByChild('cheked').equalTo(true)
      .once('value')
      .then(function (snapshot) {

        myModuleView.fillInputsStart(sel, snapshot.val());
      });
  }
  //собираем инфу из БД для инпутов
  this.prepareFillInputsHistory = function (select) {

    myAppDB.ref("users/" + (auth.currentUser).uid + "/progress")
      .once('value')
      .then(function (snapshot) {
        let arr = [];
        snapshot.forEach(function (childSnapshot) {
          arr.push(childSnapshot.key)

        });
        myModuleView.fillInputsHistory(select, arr);
      });
  }

  //находим упражнения в базе
  this.createExercisList = function (myModuleContainer, target, bodyPart, equipment, input) {

    myAppDB.ref(auth.currentUser ? "users/" + (auth.currentUser).uid + "/exercises" : "exercises").on("value", function (snapshot) {
      const exercises = snapshot.val()

      myModuleView.clearDataExercises()
      myModuleView.printExercisList(exercises, myModuleContainer, target, bodyPart, equipment, input);
    })
  }

  //создаем нового пользователя и заносим данные в БД
  this.createUser = function (userEmail, userPass) {
    auth.createUserWithEmailAndPassword(userEmail, userPass)
      .then((userCredential) => {

        const user = userCredential.user;

        myAppDB.ref("users/" + user.uid).set({
          username: userEmail,
          email: userPass
        })
          .then(function () {
            myModuleView.closeModalWindow();
            copyDataBase(user);
          })
          .catch((error) => {
            console.log(error)
          });
      })
      .catch((error) => {
        myModuleView.errorLogin(error.code, error.message)
      })
  }

  //вход в свою учетную запись и запись данных в БД
  this.loginUser = function (userEmail, userPass) {
    console.log("loginUser")
    auth.signInWithEmailAndPassword(userEmail, userPass)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const lgDate = new Date();

        console.log("1 then в loginUser - до записи в БД");

        myAppDB.ref("users/" + user.uid).update({ last_login: lgDate })
          .then(function () {
            console.log("2 then в loginUser - инфа обновлена")
            console.log("lgDate -" + lgDate)
            myModuleView.updateSignIn(user.email);
            myModuleView.closeModalWindow();
          })
          .catch((error) => {
            console.log(error)
          });
      })
      .catch((error) => {
        myModuleView.errorLogin(error.code, error.message)
        console.log(error.code, error.message)
      });
  }

  //выходит из учетной записи, закрывает окно, обновляет статус
  this.signOut = function () {
    auth.signOut();
    myModuleView.closeModalWindow()
    myModuleView.updateSignIn()
  }
  //проверка пользователя
  this.checkLogin = function () {
    // console.log("model.checkLogin")

    auth.onAuthStateChanged(function (user) {
      // console.log("model.checkLogin - " + user.email)
      if (user) {
        myModuleView.updateSignIn(user.email)
      }
    });
  }
  // подготовка для открытия модального окна регистрации или выхода
  this.prepareOpenModal = function () {

    if (auth.currentUser) {
      console.log("prepareOpenModal, юзер есть - " + auth.currentUser.email)
      myModuleView.openModalQuit(auth.currentUser)

    } else {
      console.log("prepareOpenModal юзера нет")
      myModuleView.openModalLogin()
    }
  }
  //подготовка к закрытию модального окна
  this.prepareCloseModalWindow = function () {
    myModuleView.closeModalWindow()
  }
  //подготовка для открытия модального окна для тренировки
  this.prepareOpenModalStart = function (name) {
    myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").orderByChild('name').equalTo(name)
      .once('value')
      .then(function (snapshot) {
        myModuleView.openModalStart(snapshot.val());
      });
  }

  //ещем и удаляем нужное упражнения в локальной базе
  this.findExercis = function (exercis) {

    myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").orderByChild('id').equalTo(exercis)
      .once('value')
      .then(function (snapshot) {
        console.log(snapshot);
        console.log(snapshot.val());
        snapshot.forEach(function (childSnapshot) {
          //remove each child
          myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").child(childSnapshot.key).remove();
        });
      });
  }
  //ставит метку на упражнение в локальной базе
  this.checkStatus = function (exercis, cheked) {
    myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").orderByChild('id').equalTo(exercis)
      .once('value')
      .then(function (snapshot) {
        console.log(snapshot);
        console.log(snapshot.val());
        snapshot.forEach(function (childSnapshot) {

          if (cheked === "false") {
            myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").child(childSnapshot.key).update({ cheked: true });
          } if (cheked === "true") {
            myAppDB.ref("users/" + (auth.currentUser).uid + "/exercises").child(childSnapshot.key).update({ cheked: false });
          }
        });
      });
  }
  //подготовка к заполнению инпутов
  this.checkFillInputs = function () {
    myModuleView.pastNewInputs()
  }
  //подготовка к построению графиков
  this.prepareShowGraph = function (myModuleContainer, selCheckProgress) {
    console.log(selCheckProgress)

    myAppDB.ref("users/" + (auth.currentUser).uid + "/progress/" + selCheckProgress).on("value", function (snapshot) {
      let dateKey = Object.keys(snapshot.val())
      myModuleView.showGraph(myModuleContainer, selCheckProgress, dateKey)
    })
    myModuleView.clearDataExercises()
  }
  //отправляет данные о весе и повторениях в бд
  this.sentForm = function (firstRepWeight, firstRepExercis, secondRepWeight, secondRepExercis,
    thirdRepWeight, thirdRepExercis, fourRepWeight, fourRepExercis, dataId, dataNam) {
    let newDate = new Date().getTime();
    myAppDB.ref("users/" + auth.currentUser.uid + "/progress/" + dataNam).update(
      {
        [newDate]: {
          [firstRepWeight]: firstRepExercis,
          [secondRepWeight]: secondRepExercis,
          [thirdRepWeight]: thirdRepExercis,
          [fourRepWeight]: fourRepExercis,
        }

      })
      .then(function () {
        console.log("записало в базу")
      })
      .catch((error) => {
        console.log(error)
      });
  }
  //звук
  this.playSound = function () {
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "./sound/click.m4r"; // Указываем путь к звуку "клика"
    audio.autoplay = true; // запускаем
  }
  //полноэкранный режим
  this.toggleFullScreen = function () {

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

    }
  }
  //кнопка назад
  this.backButton = function () {
    window.history.back();
  }



  //создает новую БД для нового пользователя
  copyDataBase = function (user) {

    myAppDB.ref("exercises").once("value")
      .then(function (snapchot) {

        myAppDB.ref("users/" + user.uid + "/exercises").set(snapchot.val())
          .then(function () {
            console.log(snapchot.val())
            console.log("скопирована")
          })
          .catch((error) => {
            console.log(error)
          });
      })
      .catch((error) => {
        console.log(error)
      });
  }
}
/* -------- end model -------- */

/* ----- begin controller ---- */
function ModuleController() {
  let myModuleContainer = null;
  let myModuleModel = null;

  this.init = function (conteiner, model) {
    myModuleModel = model;
    myModuleContainer = conteiner;
    // вешаем слушателя на событие hashchange
    window.addEventListener("hashchange", this.updateState);

    //проверяем, есть ли залогиненый пользователь
    myModuleModel.checkLogin();

    //первая отрисовка
    myModuleModel.updateState("main");


    //вешаем обработчик на клики
    document.addEventListener('click', function (event) {

      console.log(event.target)
      console.log(event.target.id)

      let exercis_id = event.target.parentElement.getAttribute("data-id")
      let exercis_chekedStatus = event.target.parentElement.getAttribute("data-cheked")

      //конопка ищет упражнения из базы
      switch (event.target && event.target.id) {
        case ("btnSearch"):
          myModuleModel.playSound()
          myModuleModel.createExercisList(
            myModuleContainer,
            document.getElementById("targetList").value,
            document.getElementById("bodyPartList").value,
            document.getElementById("equipmentList").value,
            document.querySelector(".name__input").value
          );
          break;

        //кнопка для регистрации нового пользователя
        case ("btn-registr"):
          myModuleModel.playSound()
          myModuleModel.createUser(
            document.getElementById("email_input").value,
            document.getElementById("password_input").value,
          );
          break;

        //кнопка, что бы войти в свою учетную запись
        case ("btn-login"):
          myModuleModel.playSound()
          myModuleModel.loginUser(
            document.getElementById("email_input").value,
            document.getElementById("password_input").value,
          );
          break;

        //открывает модальное окно с регистрационной формой
        case ("login__word"):
          myModuleModel.prepareOpenModal();
          break;

        //ссылка на имя пользователя
        case ("login__link"):
          myModuleModel.prepareOpenModal();
          break;

        // выход из модального окна по клику в любом свободном месте
        case ("background"):
          myModuleModel.playSound()
          myModuleModel.prepareCloseModalWindow();
          break;

        //кнопка разлогинивания:)
        case ("btn-signOut"):
          myModuleModel.signOut();
          break;
        //кнопка удаления упражнения
        case ("exercisDelete"):
          myModuleModel.playSound()
          myModuleModel.findExercis(exercis_id)
          break;
        //помечаем нужно упражнение
        case ("exercisCheck"):
          myModuleModel.playSound()
          myModuleModel.checkStatus(exercis_id, exercis_chekedStatus)
          break;
        //начало тренировки
        case ("startTrening"):
          myModuleModel.playSound()
          let startExercisId = document.getElementById("chekedExercises").value
          myModuleModel.prepareOpenModalStart(startExercisId);
          break;
        //заканчивает упражнения
        case ("endExercis"):
          event.preventDefault();

          let firstRepWeight = document.getElementById("firstRepWeight")
          let secondRepWeight = document.getElementById("secondRepWeight")
          let thirdRepWeight = document.getElementById("thirdRepWeight")
          let fourRepWeight = document.getElementById("thirdRepWeight")
          let firstRepExercis = document.getElementById("firstRepExercis")
          let secondRepExercis = document.getElementById("secondRepExercis")
          let thirdRepExercis = document.getElementById("thirdRepExercis")
          let fourRepExercis = document.getElementById("thirdRepExercis")
          let minRepsWrapper = document.getElementById("minRepsWrapper")
          let dataId = minRepsWrapper.getAttribute("data-id")
          let dataName = minRepsWrapper.getAttribute("data-name")

          if (
            (firstRepWeight.value && firstRepExercis.value && secondRepWeight.value && secondRepExercis.value &&
              thirdRepWeight.value && thirdRepExercis.value && fourRepWeight.value && fourRepExercis.value)) {
            console.log("зашлло в иф")

            myModuleModel.sentForm(firstRepWeight.value, firstRepExercis.value, secondRepWeight.value, secondRepExercis.value,
              thirdRepWeight.value, thirdRepExercis.value, fourRepWeight.value, fourRepExercis.value, dataId, dataName)
          }
          myModuleModel.prepareCloseModalWindow()
          break;
        //должны выводить прогресс тренировок
        case ("btnCheckProgress"):
          myModuleModel.playSound()
          let selCheckProgress = document.getElementById("selCheckProgress").value
          myModuleModel.prepareShowGraph(myModuleContainer, selCheckProgress);
          break;
        //полноэкранный режим и обратно
        case ("fullScreen"):
          myModuleModel.toggleFullScreen()
          break;
        //кнопка назад
        case ("back"):
          myModuleModel.backButton()
          break;
      }
    })

  }

  //обновление страницы
  this.updateState = function () {

    const hashPageName = location.hash ? location.hash.slice(1) : "main";

    //в зависимости от хэша проводит еще подготовительные дейстаия
    if (hashPageName == "history") {
      myModuleModel.updateState(hashPageName);
      let selProgress = document.querySelector("#selCheckProgress")
      myModuleModel.prepareFillInputsHistory(selProgress)
    }
    if (hashPageName == "exercis") {
      myModuleModel.updateState(hashPageName);
      const url = document.querySelectorAll(".selectExersices")
      myModuleModel.fillInputsBd(url);

    } if (hashPageName == "start") {
      myModuleModel.updateState(hashPageName);
      const selCheked = document.querySelector("#chekedExercises")
      myModuleModel.prepareFillInputsStart(selCheked);
    } else {
      myModuleModel.updateState(hashPageName);
    }
  }
};
/* ------ end controller ----- */
/* ------ end app ----- */

// ===========первая инициализация=============
const view = new ModuleView();
const model = new ModuleModel();
const controller = new ModuleController();

// =============связывание частей mvc===
view.init();
model.init(view);
controller.init(document.getElementById("content"), model);