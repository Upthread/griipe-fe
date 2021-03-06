import React, {Component} from 'react'
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import './ComplaintCard.css';
import MaterialIcon, {colorPalette} from 'material-icons-react';

  export default class ComplaintCard extends Component {
    render() {
        return (
            <div>
                <Card className="card-container">

                        <div class="upvote-container">
                            <div>
                            <i class="fas fa-chevron-up"></i>
                        <p class="upvote">{this.props.card.upVote}</p>
                            <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>

                    <CardBody>
                        
                    <div>
                        <div class="titleAddy">
                        <CardText className="cardTitle">{` ${this.props.card.StoreName}`}</CardText>

                        <CardText className="cardAddress">{`${this.props.card.StoreLocation}`}</CardText>
                        </div>

                        <CardText className="complaintText"><strong>Anonymous:</strong>{` ${this.props.card.tweet}`}</CardText>


                        </div>

                    </CardBody>
                </Card>
            </div>
        );
    }
}