import {Modal } from "react-bootstrap";

export function MoreInfo({ show, closeModal }: { show: boolean, closeModal: () => void }) {

    return <Modal show={show} onHide={() => closeModal()}>

        <Modal.Header closeButton>
            <Modal.Title>About the 50/30/20 Principle</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <h5>What is the 50/30/20 Principle?</h5>
            <p>
                Simply put, it is an intuitive and straightforward budget rule that can help you draw up a reasonable budget
                you can stick to over time in order to meet your financial goals. <br/>
                The rule is to split your after-tax income into three categories of spending: 50% on needs, 30% on wants, and 20% on savings.
            </p>
            <h5>Adaptable by Nature.</h5>
            <p>
                Of course, everyone’s situation is different and the 50/30/20 split may not work for you. If you feel like saving 20% is not realistic,
                you could try and adjust the percentages and aim to save a smaller amount — 10% or 5% each month, for example.
            </p>

            <h5>Benefits:</h5>
            <ul>
                <li><b>Ease of Use:</b> The 50/30/20 rule offers a straightforward framework for budgeting, making it simple to comprehend and apply. You may distribute your income immediately without the need for intricate calculations.
                    Even the least financially-savvy person can adhere to these rules.</li>

                <li><b>Prioritization of vital expenses:</b> You can make sure that you cover your fundamental needs without going over budget or taking on too much debt by giving these basics top priority. As these rules stipulate that half of your budget goes towards needs,
                    this plan helps make sure your essentials are more likely to be met.</li>

                <li><b>Emphasis on savings goals:</b> By allocating 20% of your income to savings, you can set up an emergency fund, prepare for retirement, pay off debt, invest, or pursue other financial goals. By consistently saving this amount,
                    you establish sound financial practices and build a safety net for unforeseen costs or future goals.</li>
            </ul>
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>
    </Modal>
}