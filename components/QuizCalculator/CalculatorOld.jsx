var Provider = ReactRedux.Provider;
console.log('questions = ' + JSON.stringify(questions));
console.log('answers = ' + JSON.stringify(answers));


var divId = 'calculator';

var initialState = {
  quizId: quizId,
  questions: questions,
  answers: answers,
  chosenAnswers: [],
  currentQuestion: {},
  firstQuestion: firstQuestion,
  calcParams: calcParams,
  backgrounds: backgrounds,
  isAuthorized: isAuthorized
}

const DEL_CHOSEN_ANSWER = 'DEL_CHOSEN_ANSWER';
const ADD_CHOSEN_ANSWER = 'ADD_ANSWER';
function findNextQuestion(questions, id) {
  return questions.find(function (question) {
    return question.id == id;
  });
}

function findAnswer(answers, id) {
  return answers.find(function (answer) {
    return answer.id == id;
  });
}

var camelize = (string) => string.replace(/-([a-z])/gi, (s, group) => group.toUpperCase());
const style2object = (style) => style.replace(/\s/g, '').split(';').filter(s => s.length)
  .reduce((a, b) => {
    const keyValue = b.split(':');
    a[camelize(keyValue[0])] = keyValue[1];
    return a;
  }, {});
function userAction(state = initialState, action) {
  var nextQuestion;
  switch (action.type) {
    case DEL_CHOSEN_ANSWER:
      //console.log('DEL_CHOSEN_ANSWER: state.chosenAnsers = ' + JSON.stringify(state.chosenAnswers) );
      var prevChosenAnswers = state.chosenAnswers;
      //console.log('DEL_CHOSEN_ANSWER: prevChosenAnswers = ' + JSON.stringify(prevChosenAnswers) );

      var modifiedChosenAnswers = [];
      for (i = 0; i < prevChosenAnswers.length; i++) {

        if (prevChosenAnswers[i].id == action.answer.id) {
          break;
        } else {
          modifiedChosenAnswers = modifiedChosenAnswers.concat(prevChosenAnswers[i]);
        }
      }

      var nextIssueId;
      if (modifiedChosenAnswers.length === 0) {
        nextIssueId = findNextQuestion(state.questions, state.firstQuestion);
      } else {
        nextIssueId = modifiedChosenAnswers[modifiedChosenAnswers.length - 1].properties.nnext_issue;
      }

      var nextCurrentQuestion = findNextQuestion(state.questions, nextIssueId);

      return (
        {
          quizId: state.quizId,
          questions: state.questions,
          answers: state.answers,
          chosenAnswers: modifiedChosenAnswers,
          currentQuestion: nextCurrentQuestion,
          firstQuestion: firstQuestion,
          calcParams: calcParams,
          backgrounds: backgrounds,
          isAuthorized: isAuthorized
        }
      )
    case ADD_CHOSEN_ANSWER :
      nextQuestion = findNextQuestion(state.questions, action.answer.properties.nnext_issue);
      return (
        {
          quizId: state.quizId,
          questions: state.questions,
          answers: state.answers,
          chosenAnswers: [...state.chosenAnswers, action.answer],
          currentQuestion: nextQuestion,
          firstQuestion: firstQuestion,
          calcParams: calcParams,
          backgrounds: backgrounds,
          isAuthorized: isAuthorized
        }
      )

    default:
      const chosenAnswers = initialState.chosenAnswers;
      return (
        {
          quizId: state.quizId,
          questions: state.questions,
          answers: state.answers,
          chosenAnswers: chosenAnswers,
          currentQuestion: {},
          firstQuestion: firstQuestion,
          calcParams: calcParams,
          backgrounds: backgrounds
          , isAuthorized: isAuthorized
        }
      )

  }

}

//var store = Redux.createStore(userAction);
var store = Redux.createStore(userAction, window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__());
//store.subscribe(() => console.log('subscribe', store.getState())      );

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(() => {
      console.log('subscribe', store.getState());
    });
  }

  render() {
    let questionEl;
    let questionObj;
    let calcResult;
    if (this.props.currentQuestion === undefined || this.props.currentQuestion == null || (Object.keys(this.props.currentQuestion).length === 0 && this.props.currentQuestion.constructor === Object)) {
      var firstQuestion = findNextQuestion(this.props.questions, this.props.firstQuestion); // 07.05.2020
      questionEl = <Question id="question" question={firstQuestion}/>;
      //questionEl = <Question id="question" question={this.props.questions[0]}/>;
      calcResult = <div key={Math.random()}></div>;
    } else {
      questionEl = <Question id="question" question={this.props.currentQuestion}/>;
      var chosenListAnswers;
      if (this.props.currentQuestion.properties.sshow_type === 'SYSTEM_END') {
        //calcResult = <ConnectedCalcResultComponent key={Math.random()}/>;
        calcResult = <ErrorBoundary><ConnectedCalcResultComponent key={Math.random()}/></ErrorBoundary>;
        chosenListAnswers = <div key={Math.random()}/>
      } else {
        calcResult = <div key={Math.random()}></div>;
        chosenListAnswers = <ChosenListAnswers key={Math.random()} chosenAnswers={this.props.chosenAnswers}/>
      }

    }

    console.log('this.props.value.backgrounds = ' + JSON.stringify(this.props.backgrounds));
    var styleObj = this.props.backgrounds;
    var beforeStyle;
    var afterStyle;
    if (styleObj !== undefined && styleObj.psbg_after_url !== null) {
      var beforeStyleProp = styleObj.psbg_before_url.trim();
      if (beforeStyleProp.slice(-1) === ';') {
        beforeStyleProp = beforeStyleProp.substr(0, beforeStyleProp.length - 1);
        beforeStyle = {background: beforeStyleProp};
      }
    } else {
      beforeStyle = {background: ''};
    }

    if (styleObj !== undefined && styleObj.psbg_after_url !== null) {
      var afterStyleProp = styleObj.psbg_after_url.trim();
      if (afterStyleProp.slice(-1) === ';') {
        afterStyleProp = afterStyleProp.substr(0, afterStyleProp.length - 1);
        afterStyle = {background: afterStyleProp};
      }
    } else {
      afterStyle = {background: ''};
    }


    /*<div className="calculator-bg-bg" style={beforeStyle}></div>
     <div className="calculator-ppl-bg" style={afterStyle}></div>
     */
    return (
      <div>


        <div className="calculator-bg-bg" style={beforeStyle}></div>
        <div className="calculator-ppl-bg" style={afterStyle}></div>
        <div className="block-calc" id="calculator-item">
          <h2>
            {this.props.calcParams.stitle_h1}
          </h2>
          <div className="calc-description ">
            {this.props.calcParams.stitle_h2}
          </div>

          {calcResult}

          {chosenListAnswers}

          {questionEl}

        </div>
      </div>)
  }
}

class CalcResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      hasErrors: false,
      isLoading: true,
    }
  }

  componentDidMount() {
    var params = "?quizId=" + JSON.stringify(this.props.quizId);
    this.props.chosenAnswers.map((currentAnswer) =>
      {
        var question = findNextQuestion(this.props.questions, currentAnswer.properties.idclient_quiz_issue);
        params += '&' + question.properties.svalue_name + '=' + currentAnswer.properties.svalue_value;
      }
    );
    //const url = "http://localhost:50005/WarAgentResoRu/newClientResoRu/calculators" + params;
    //const url = "https://testclient.reso.ru/WarAgentResoRu/newClientResoRu/calculators" + params;
    const url = "/WarAgentResoRu/newClientResoRu/calculators" + params;

    fetch(url).
    then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        this.setState({result: null, hasError: true, isLoading: false})
//throw new Error('Something went wrong');
      }
    })
      .then(result => {
        //this.setState({result: result, hasError: false});
        this.setState({result: result.resultMap, hasError: false, isLoading: false});
      }).catch((err) => {
      console.log('Fetch Error :-S', err);
      this.setState({result: null, hasError: true, isLoading: false});
    });
  }

  /*{
   this.state.result.map(res => <li key={Math.random}>{res.premiumOsago}</li>)}*/
  render() {
    if (this.state.hasErrors === false) {
      var reg = /\-?(\d*)\.?(\d{0,5})/;
      var arr = reg.exec(this.state.result.premiumOsago);
      //var rub = arr[1];
      var rub = parseInt(arr[1]).toLocaleString();
      var kop = arr[2];
      if (kop.length === 1) {
        kop = kop + '0'
      }
      else if(kop.length ==0) {
        kop = kop + '00';
      }

      var imgStyle = {
        height: "24px"
      }

      var preloader = <img key={Math.random()} src="/WarAgentResoRu/resources/images/newClientResoRu/2.gif" style={imgStyle}/>
      //var preloader = <span key={Math.random}> загружаем </span>
      var fetchedResult = <div><span key={Math.random()} className="h1">{rub}</span><span key={Math.random()} >.{kop} ₽</span><span key={Math.random()}  className="finish-price-text">&nbsp;— предварительная стоимость полиса</span></div>

      var link;
      if(this.props.isAuthorized === true && this.props.isAuthorized !== undefined) {
        //link = "https://testclient.reso.ru/WarAgentResoRu/newClientResoRu/auth/login.xhtml?welcome_id=wlc1799";
        link = "/WarAgentResoRu/newClientResoRu/profile/offer_osago.xhtml";
      }
      else {
        link = "/WarAgentResoRu/newClientResoRu/auth/login.xhtml?welcome_id=wlc1799";
      }

      return (
        <div>
          <div className="finish-price mt-2">
            {
              this.state.isLoading ? preloader : fetchedResult }
          </div>
          <p className="fsz-18 mt-3"></p>
          <div className="finish-price-action conteiner-fluid">
            <ul className="row">
              <li className="col-4">
                <a href={link}>
                  <img src="/WarAgentResoRu/resources/images/newClientResoRu/price-action1.svg"/>
                  Оформить ОСАГО</a>
              </li><li className="col-4">
              <NewCalc/>
            </li></ul>
          </div>
        </div>

      )
    } else {
      return (
        <div className="finish-price mt-2">
          <span key={Math.random()}  className="finish-price-text">&nbsp; Произошла ошибка. Повторите попытку позже</span>
        </div>

      )
    }
  }
}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
// Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
// Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
// Можно отрендерить запасной UI произвольного вида
      return (
        <div className="calc-alert-info row align-items-center">
          <div className="col-2">
            <img src="/WarAgentResoRu/resources/images/newClientResoRu/calc-warning.svg"/>
          </div>
          <div className="col-10">
            <span className="text-danger">Неполадки сети.</span><br/>
            <a href="">Попробуйте попытку позже.</a>
          </div>
        </div>
      )
    }

    return this.props.children;
  }
}

class QuestionListAnswers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const listItems = this.props.answers.map((currentAnswer) =>
      {

        if (currentAnswer.properties.idclient_quiz_issue == this.props.question.id && currentAnswer.properties.lactive == 1) {
//console.log("currentAnswer = " + JSON.stringify(currentAnswer));
          return <QuestionAnswer value={currentAnswer} key={currentAnswer.id}/>
        }
      }
    );

    var filteredItems = listItems.filter(function (item) {
      if (item === null || item === undefined) {
        return false;
      } else {
        return true;
      }
    });
    return (
      <ul className="select-items">
        {filteredItems}


      </ul>
    )



  }
}


class NewCalc extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick() {
    store.dispatch({type: 'NEW_CALC', answer: null});
  }
  render() {
    var cursorStyle = {cursor: 'pointer'};
    return (
      <a onClick={
        this.handleClick} style={cursorStyle}>
        <img src="/WarAgentResoRu/resources/images/newClientResoRu/price-action3.svg"/>
        Сделать новый расчет</a>
    )
  }
}



class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var answers;

    if (this.props.question.properties.sshow_type === 'select') {
      answers = <ConnectedSelectAnswerComponent  key={Math.random()} id="questionSelectAnswer" question={this.props.question}/>;
    }
    else if(this.props.question.properties.sshow_type ==='STRING') {
      answers = <ConnectedTextAnswerComponent id="questionTextAnswer" key={Math.random()} question={this.props.question}/>;
    }
    else if(this.props.question.properties.sshow_type ==='NUMBER') {
      answers = <ConnectedNumberAnswerComponent id="questionNumberAnswer" key={Math.random()} question={this.props.question}/>;
    }
    else {
      answers = <ConnectedQuestionListAnswersComponent id="questionListAnswers" key={Math.random()} question={this.props.question}/>;
    }

    return (
      <div>
        <div className="calc-action-title">
          {
            this.props.question.name}
        </div>
        <div className="calc-action">
          <div className="calc-select-label">
            {this.props.question.properties.sdop_info}
          </div>
          {answers}
        </div>
      </div>

    )
  }
}


class TextAnswer extends React.Component{
  constructor(props) {
    super(props);
    console.log("TextAnswer: this.props = " + this.props);

    this.textInput = React.createRef();


  }

  render() {

    var question_id = this.props.question.id;
    const textAnswer = this.props.answers.filter(
      function(currentAnswer ) {
        if (currentAnswer.properties.idclient_quiz_issue == question_id && currentAnswer.properties.lactive == 1)  {
          return currentAnswer;
        }
      });

    return (
      <div>
        <InputTextAnswer key={textAnswer[0].id} value={textAnswer[0]} answer={textAnswer[0]}/>
      </div>
    );
  }
}


class InputTextAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.textInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClick(event) {
    if(this.state.value !== '') {
      var ans = this.props.answer;
      ans.properties.svalue_value = this.state.value;
      ans.name = this.state.value;
      store.dispatch({type: 'ADD_ANSWER', answer: ans});
    }
  }
  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.value = event.target.value;
  }
  handleSubmit(event) {
    if(this.state.value !== '') {
      var ans = this.props.answer;
      ans.properties.svalue_value = this.state.value;
      ans.name = this.state.value;
      store.dispatch({type: 'ADD_ANSWER', answer: ans});
    }
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input autoFocus id={this.props.answer.id} key={this.props.answer.id} ref={this.textInput} type="text" value={this.state.value} onChange={this.handleChange}/>
        <a key={Math.random()}  className="next-button" onClick={this.handleClick}>Далее</a>
      </form>

    );
  }
}


class NumberAnswer extends React.Component{
  constructor(props) {
    super(props);
    this.numberInput = React.createRef();
  }

  render() {

    var question_id = this.props.question.id;
    const textAnswer = this.props.answers.filter(
      function(currentAnswer ) {
        if (currentAnswer.properties.idclient_quiz_issue == question_id && currentAnswer.properties.lactive == 1)  {
          return currentAnswer;
        }
      });

    return (
      <div>
        <InputNumberAnswer key={textAnswer[0].id} value={textAnswer[0]} answer={textAnswer[0]}/>
      </div>
    );
  }
}


class InputNumberAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.textInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClick(event) {
    var ans = this.props.answer;
    if(this.state.value !== '') {
      ans.properties.svalue_value = this.state.value;
      ans.name = this.state.value;
      store.dispatch({type: 'ADD_ANSWER', answer: ans});
    }
  }
  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.value = event.target.value;
  }
  handleSubmit(event) {
    var ans = this.props.answer;
    if(this.state.value !=='') {
      ans.properties.svalue_value = this.state.value;
      ans.name = this.state.value;
      store.dispatch({type: 'ADD_ANSWER', answer: ans});
    }
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input autoFocus id={this.props.answer.id} key={this.props.answer.id} ref={this.textInput} type="number" value={this.state.value} onChange={this.handleChange}/>
        <a key={Math.random()}  className="next-button" onClick={this.handleClick}>Далее</a>
      </form>

    );
  }
}


class SelectAnswer extends React.Component {
  state = {
    selectedOption: null,
  }
  handleChange = (selectedOption) => {
    this.setState({selectedOption});
  }
  handleClick() {
    if (this.state.selectedOption !== null && this.state.selectedOption !== undefined) {
      var answer = findAnswer(this.props.answers, this.state.selectedOption.value);
      store.dispatch({type: 'ADD_ANSWER', answer: answer});
    }
  }
  render() {

    const items = this.props.answers.map((currentAnswer) =>
    {
      if (currentAnswer.properties.idclient_quiz_issue == this.props.question.id) {
        //return <QuestionAnswer value={currentAnswer} key={currentAnswer.id}>{currentAnswer.name}</QuestionAnswer>
        return {value: currentAnswer.id, label: currentAnswer.name}
      }
    });
    var filteredItems = items.filter(function (img) {
      if (img === null || img === undefined) {
        return false;
      } else {
        return true;
      }
    });
    var divStyle = {
      width: '350px'
    }
    const {
      selectedOption} = this.state;
    return (
      <div className="d-table">
        <div className="d-table-cell">
          <div style={
            divStyle}>
            <Select
              ref={ref => {
                this.selectRef = ref;
              }}
              autoFocus
              placeholder='Начните вводить регион'
              className='react-select-container'
              classNamePrefix="react-select"
              value={selectedOption}
              onChange={this.handleChange}
              options={filteredItems}
            />
          </div>
        </div>
        <div className="d-table-cell">
          <a href="" className="next-button" onClick={this.handleClick()}>Далее</a>
        </div>
      </div>
    );
  }
}





class ChosenListAnswers extends React.Component {
  constructor(props) {
    super(props);
    //console.log("ChosenListAnswers: this.props = " + JSON.stringify(this.props));
    //console.log("ChosenListAnswers: this.props.chosenAnswers.length = " + this.props.chosenAnswers.length);

  }
  render() {
    return (
      <ul className="select-finish-items" key={Math.random()}>
        {this.props.chosenAnswers.map(answer => {
            if (answer !== undefined)
              return (
                <ChosenAnswer key={answer.id} answer={answer}/>
              )
          }
        )}

      </ul>
    )
  }
}

class QuestionAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    //console.log("QuestionAnswer: this.props = " + JSON.stringify(this.props) );
  }

  handleClick() {
//console.log("QuestionAnswer: handleClick: answer = " + JSON.stringify(this.props.value) );
    store.dispatch({type: 'ADD_ANSWER', answer: this.props.value});
  }
  render() {

    if (this.props.value.properties.sli_css_class !== null && this.props.value.properties.sli_css_class !== undefined) {

      var styleObj = style2object(this.props.value.properties.sli_css_class);
      console.log("styleObj = " + JSON.stringify(styleObj));
      return (
        <li value={this.props.value.id} key={this.props.value.id} style={styleObj} onClick={this.handleClick}>{this.props.value.name}</li>
      )
    } else {
      return (
        <li value={this.props.value.id} key={this.props.value.id} onClick={this.handleClick}>{this.props.value.name}</li>
      )
    }
  }
}

class ChosenAnswer extends React.Component {
  constructor(props) {
    super(props)
    //console.log("ChosenAnswer: this.props = " + JSON.stringify(this.props));
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
//console.log('ChosenAnswer: handleClick: this.props = ' + JSON.stringify(this.props));
    store.dispatch({type: 'DEL_CHOSEN_ANSWER', answer: this.props.answer});
  }

  render() {
    return (
      <li value={this.props.answer.id} key={Math.random()}>{this.props.answer.name}<button className="select-finish-items-del" onClick={this.handleClick}></button>
      </li>
    )
  }
}

var ConnectedCalculatorComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId,
      questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion,
      firstQuestion: state.firstQuestion,
      calcParams: state.calcParams,
      backgrounds: state.backgrounds,
      isAuthorized: state.isAuthorized
    }
  }
)(Calculator);

var ConnectedQuestionListAnswersComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId, questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion}
  }
)(QuestionListAnswers);

var ConnectedSelectAnswerComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId, questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion}
  }
)(SelectAnswer);

var ConnectedTextAnswerComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId, questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion}
  }
)(TextAnswer);

var ConnectedNumberAnswerComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId, questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion}
  }
)(NumberAnswer);

var ConnectedCalcResultComponent = ReactRedux.connect(
  function mapStateToProps(state) {
    return {quizId: state.quizId, questions: state.questions,
      answers: state.answers,
      chosenAnswers: state.chosenAnswers,
      currentQuestion: state.currentQuestion,
      isAuthorized: state.isAuthorized
    }
  }
)(CalcResult);

console.log("*** store = " + JSON.stringify(store));

/*ReactDOM.render(<Provider store={
    store}>
    <ConnectedCalculatorComponent/>
</Provider>, document.getElementById('calculator'));
*/

ReactDOM.render(<Provider store={
  store}>
  <ConnectedCalculatorComponent/>
</Provider>, document.getElementById('calculator'));
