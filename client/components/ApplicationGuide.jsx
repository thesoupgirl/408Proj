import React from 'react'
import {
  Button,
  FormControl,
  FormGroup,
  Jumbotron,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown
} from 'react-bootstrap'
import { map } from 'lodash'
import SweetAlert from 'react-bootstrap-sweetalert'





class ApplicationGuide extends React.Component {
	
  constructor(props) {
    super(props)
  }

  
  
   render() {
    return (
      <div className='container'>
        <Jumbotron>
   


          <p style={{color: "black", fontWeight: 'bold', fontSize: '50px', textDecorationStyle: "solid", border:'10px solid #000000', textAlign: 'center' }}> Destressing Methods </p>

     
        </Jumbotron>

  <img  width={900} height={600} alt="900x600"  src={require('../image/EpsteinOne.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "red", fontWeight: 'bold', fontSize: '35px',  textDecorationLine: "underline", textDecorationStyle: "solid", fontStyle: 'italic'}}>Understanding stress symptoms </p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Cognitive symptoms</p>
<p> • Memory problems</p>
<p> • Inability to concentrate</p>
<p> • Poor judgement</p>
<p> • Seeing only the negative</p>
<p> • Anxious or racing thoughts</p>
<p> • Constant worrying</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Physical symptoms</p>
<p>• Aches and pains</p>
<p>• Diarrhea or constipation</p>
<p>• Nausea, dizziness</p>
<p>• Chest pain, rapid heart rate</p>
<p>• Loss of sex drive</p>
<p>• Frequent colds or flu</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Emotional symptoms</p>
<p>• Depression or general unhappiness</p>
<p>• Anxiety and agitation</p>
<p>• Moodiness, irritability, or anger</p>
<p>• Feeling overwhelmed</p>
<p>• Loneliness and isolation</p>
<p>• Other mental or emotional health problems</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Behavioral symptoms</p>
<p>• Eating more or less</p>
<p>• Sleeping too much or too little</p>
<p>• Withdrawing from others</p>
<p>• Procrastinating or neglecting responsibilities</p>
<p>• Using alcohol, cigarettes, or drugs to relax</p>
<p>• Nervous habits (e.g. nail biting, pacing)</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Seeking psychological help </p>
<p>One recommendation commonly offered by doctors for seeking psychological help is counselling and psychotherapy. Talking with a professional about the difficulties you're experiencing can help you understand any underlying issues that may be causing your stress - for example, low self-esteem.</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}>Safety Plan</p>
<p> Seek self-help stress management support groups.</p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Information on de-stressing methods </p>
<p> • Regular exercise can lift your mood and serve as a distraction from worries, allowing you to break out of the cycle of negative thoughts that feed stress.</p>
<p> • The simple act of talking face-to-face with another human can trigger hormones that relieve stress when you're feeling agitated or insecure.</p>
<p> • Engage one or more of your senses—sight, sound, taste, smell, touch, or movement. </p>
<p> • Relaxation techniques such as yoga, meditation, and deep breathing activate the body’s relaxation response, a state of restfulness that is the polar opposite of the stress response.</p>
<p> • Eat a diet rich in fresh fruit and vegetables, high-quality protein, and omega-3 fatty acids.</p>
<p> • Take good care of yourself and get plenty of rest.</p>

<p style={{color: "grey", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> List of sources:</p>
<p>https://www.webmd.com/balance/stress-management/stress-management-topic-overview#2</p>
<p>https://www.counselling-directory.org.uk/stress.html</p>



        
      </div>
      )
   }
  }
  export default ApplicationGuide