import { useNavigate } from "react-router-dom"
import logo from '../assets/svg/ecosysteme.ai_logo.svg'

const staticData = {
    header: "Terms and Conditions",
    lastDate: "Last Updated:",
    description: "Welcome to Ecosysteme.ai! By using the Ecosysteme.ai platform and services, you agree to the following terms and conditions. Please read them carefully.",
    point1: {
        header: "1. Acceptance of Terms"
    },
    point2: {
        header: "2. Account Creation and Eligibility",
        points: [{ label: "Eligibility: ", value: "You must be at least 18 years old (or the age of majority in your jurisdiction) to use our services. By registering, you represent that you have the legal capacity to enter into this agreement. If you are signing up on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms." },
        { label: "Account Registration: ", value: "When you create an account, you agree to provide truthful, current, and complete information about yourself (or your organization) as prompted by our registration form. You are responsible for maintaining the accuracy of this information." },
        { label: "Account Security: ", value: "You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account. Please use a strong password and limit access to your account. Notify us immediately at" }
        ],
        link: "contact@ecosysteme.ai",
        description: "if you suspect any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to secure your account."
    },
    point3: {
        header: "3. Subscription Plans and Services",
        points: [{ label: "Services: ", value: "Ecosysteme.ai offers a software-as-a-service platform that provides AI-powered agents to assist you in various tasks. Our services are offered through different subscription tiers, which may provide varying features, usage limits, or levels of service. Details of each subscription tier (including current pricing and features) are provided on our website. We reserve the right to modify, add, or remove features or services in each tier at any time, and will use reasonable efforts to notify you of significant changes." },
        { label: "Subscription Term: ", value: "When you subscribe to Ecosysteme.ai, you receive access to the platform and AI agents for the duration of your paid subscription period (e.g., monthly or annually, depending on the plan you choose). Subscriptions will automatically renew at the end of each billing cycle unless you cancel your subscription in accordance with the Cancellation and Termination section below." }
        ]
    },
    point4: {
        header: "4. Free Trials",
        description: "We may offer free trial periods for new users to try our platform. A free trial (if available) will grant you temporary access to the services for a specified period without charge. Free trials are limited to one per person/organization unless otherwise stated. We reserve the right to determine your eligibility for a free trial and to modify or terminate any free trial offer at any time without prior notice. At the end of a free trial, if you have not chosen a paid subscription and provided payment information, your access to the service may be downgraded or terminated. If you have provided payment information for a trial, your subscription will automatically convert to a paid plan at the then-current rate unless you cancel before the trial ends."
    },
    point5: {
        header: "5. Fees, Billing, and Payment",
        points: [{ label: "Fees: ", value: "By signing up for a paid subscription, you agree to pay the subscription fees for the plan you select, as well as any applicable taxes. All fees are stated in the currency indicated on our website (and, if not stated, they will be charged in Swiss francs or another applicable currency) and are exclusive of taxes unless stated otherwise. You are responsible for any taxes or charges imposed by governmental authorities (excluding taxes on our income)." },
        { label: "Billing Cycle: ", value: "Subscription fees are charged in advance on a recurring basis (e.g., monthly or annually) on the first day of each billing period. When you subscribe, you must provide a valid payment method (such as a credit card) through our payment provider. By providing a payment method, you authorize us to charge the applicable subscription fees to that payment method on a recurring schedule." },
        { label: "Auto-Renewal: ", value: "Your subscription will automatically renew at the end of each billing cycle unless you cancel it before the renewal date. We will continue to bill your payment method for the renewal term of your subscription (at the same fee or at an updated price if we have notified you of a change in the subscription price)." },
        { label: "Payment Failures: ", value: " If we cannot charge your payment method (for example, due to expiration or insufficient funds), we may suspend or terminate your access to the service. It is your responsibility to keep your billing information current and ensure sufficient funds are available for each charge. We may attempt to contact you for updated payment information if a payment fails." },
        { label: "No Refunds:", value: "All payments are final and non-refundable. We do not offer refunds or credits for any partial subscription periods, unused services, or downgrades in plan. If you cancel in the middle of a billing cycle, you will retain access to the service until the end of the period you have paid for, but you will not receive a refund or credit for any remaining days. The only exceptions to this no-refund policy are if a refund is required by law or explicitly provided under a specific promotional offer or consumer protection regulation." }
        ]
    },
    point6: {
        header: "6. Cancellation and Termination",
        points: [{ label: "Termination by Us: ", value: "We reserve the right to suspend or terminate your account or access to the service at any time, with or without notice, if you violate these Terms, misuse the service, fail to pay fees when due, or if we are required to do so for legal reasons. In most cases of minor violations, we will provide you with a warning and an opportunity to correct the issue, but for serious or repeated violations we may suspend or terminate your access immediately. We are not liable to you or any third party for termination of your account in accordance with these Terms." },
        { label: "Effect of Termination: ", value: "Upon termination or expiration of your subscription for any reason, your right to access and use the Ecosysteme.ai platform will immediately end. We may delete or deactivate your account and all associated data after the effective date of termination, except to the extent we are required to retain certain data for legal or administrative purposes. It is your responsibility to export or back up any data or content you wish to retain prior to the end of your subscription. Sections of these Terms that by their nature should survive termination (such as intellectual property rights, disclaimers, and limitations of liability) will remain in effect." },
        ]
    },
    point7: {
        header: "7. Third-Party Integrations and Services",
        description: "Our platform may offer features that integrate with third-party services (for example, social media platforms, messaging services, email providers, CRM systems, or other applications such as Instagram, WhatsApp, Gmail, etc.). These integrations are provided to enhance your experience, but their use is subject to the following conditions:",
        points: [{ label: "User Consent and Authorization: ", value: " If you choose to connect or integrate a third-party service with Ecosysteme.ai, you grant us permission to access and interact with that service on your behalf. For example, if you connect your Instagram account, you are authorizing our platform and AI agents to retrieve data from and perform allowed actions on Instagram through your account. You acknowledge that by enabling a connection, certain data from the third-party service may be transmitted to or through our platform (in accordance with our Privacy Policy). You can disconnect integrations at any time, but note that disconnecting may limit the functionality of certain AI agents or features." },
        { label: "Compliance with Third-Party Terms: ", value: "You agree to comply with all terms and conditions of any third-party services you integrate with our platform. This includes, but is not limited to, the terms of service, usage policies, and privacy policies of those third-party platforms (e.g., Instagram’s Terms of Use, WhatsApp’s terms, Gmail/Google’s terms, etc.). You are responsible for ensuring that your use of the Ecosysteme.ai platform in conjunction with those services (for example, sending messages or content via your connected accounts) does not violate any applicable third-party policies or any laws." },
        { label: "User Responsibility: ", value: "You are solely responsible for the content and communications sent through any third-party integration using our platform. For instance, if your AI agent sends messages or posts content on your behalf via a connected account, you are responsible for that content and its consequences. Ensure that you have all necessary rights and permissions to use any third-party accounts with our service. If a third-party service imposes usage limits or rules (such as message rate limits or content restrictions), you must adhere to those limits when using the integration. Any consequences of violating a third-party’s terms (for example, your social media account being suspended) are your responsibility." },
        { label: "Third-Party Disclaimers: ", value: "Ecosysteme.ai is not affiliated with or endorsed by the third-party services that integrate with our platform. Your use of third-party services is governed by your agreements with those third parties, not by Ecosysteme.ai. We make no warranties or guarantees about the availability or performance of any third-party integration features. Third-party services may change or discontinue their functionality or API access at any time, which can affect the operation of our integrations. We are not responsible for any effects on our services caused by the actions of third-party providers." },
        { label: "Liability: ", value: "To the maximum extent permitted by law, Ecosysteme.ai will not be liable for any damages or losses arising from your use of third-party integrations or services. We do not control those third-party services and are not responsible for their actions, omissions, or errors. If you have an issue or dispute with a third-party service (for example, if data is lost or a third-party account is disabled), you must resolve it with that third-party provider. You agree that Ecosysteme.ai has no obligation or liability in connection with any such third-party issues." }
        ],
        description2: "By enabling any third-party integration, you explicitly consent to our platform accessing and using your third-party account data as needed to provide the integrated features. If you do not agree to the above conditions, please do not enable or use third-party integrations on Ecosysteme.ai."
    },
    point8: {
        header: "8. Acceptable Use Policy",
        description: "We strive to maintain a safe, lawful, and respectful environment for all users. By using Ecosysteme.ai, you agree to use our platform and AI agents responsibly and only for their intended purposes. You must not:",
        points: [{ label: "Violate Laws or Regulations: ", value: "Use the service for any unlawful purpose or in violation of any local, national, or international laws or regulations. This includes (but is not limited to) laws and regulations relating to privacy, data protection, unsolicited communications (spam), intellectual property, and export control." },
        { label: "Abuse, Harass, or Harm: ", value: "Use the platform to engage in activity that is harmful, fraudulent, defamatory, obscene, harassing, or threatening. Do not use AI agents to send spam, unwanted messages, or to harass or deceive anyone." },
        { label: "Infringe Rights: ", value: "Upload, generate, or transmit any content that infringes or violates the intellectual property rights or privacy rights of others. You should only use content (text, images, data, etc.) that you have the right to use, and you should not ask the AI agents to produce content that violates someone else’s rights." },
        { label: "Interfere with the Service: ", value: " Attempt to interfere with or disrupt the proper functioning of the platform or the servers and networks connected to the service. This includes not introducing viruses or malicious code, not attempting to bypass security measures, and not overloading the system with unreasonable requests (e.g., performing denial-of-service attacks)." },
        { label: "Reverse Engineer or Misuse: ", value: "Attempt to reverse engineer, decompile, or extract the source code of our software, or use the service in a way that is not authorized by these Terms. You may not reproduce, sell, or exploit any part of the service without our express permission." },
        { label: "Misrepresent or Impersonate: ", value: "Misrepresent your identity or affiliation while using the service. If your AI agent interacts with others (for example, sending an email or message), do not impersonate another person or organization, or mislead others about the origin of the communication. The AI agents should be used in ways that are transparent and honest about who is behind the interaction." },
        ],
        description2: "We reserve the right to monitor and review your usage of the platform to ensure compliance with this Acceptable Use Policy. If we (in our sole discretion) determine that you have violated this policy or any other provision of these Terms, we may suspend or terminate your access to Ecosysteme.ai without prior notice, and we may take legal action if appropriate. You are responsible for any legal consequences (including costs or penalties) that result from your misuse of our platform."
    },
    point9: {
        header: "9. Intellectual Property Rights",
        points: [{ label: "Our Intellectual Property: ", value: "All rights, title, and interest in and to the Ecosysteme.ai platform and services, including our software, algorithms, content, materials, and trademarks (“Ecosysteme.ai Content”), are owned by us or our licensors and are protected by intellectual property laws. Ecosysteme.ai grants you a limited, non-exclusive, non-transferable, revocable license to access and use the platform and Ecosysteme.ai Content for your own personal or internal business use, in accordance with these Terms. Except as expressly permitted by us, you may not copy, modify, distribute, sell, or lease any part of our platform or included content. You also may not reverse engineer or attempt to extract the source code of our software, except to the extent that such activity is expressly permitted by applicable law." },
        { label: "Your Content: ", value: "You retain all rights to the content, data, and materials that you upload or provide through our platform (“User Content”), as well as to the outputs generated by the AI agents based on your User Content or instructions (your “Output”). We do not claim ownership over your User Content or your Output. However, by using our service, you grant us a worldwide, royalty-free license to host, use, copy, and process your User Content and Output for the purpose of operating and improving the service. For example, we may need to store your data and run it through our algorithms to generate results for you, or backup your data to prevent loss. We will only access and use your content as permitted by these Terms and our Privacy Policy. You are responsible for ensuring that you have the necessary rights to submit your User Content to the platform and that your User Content (and the AI Output derived from it) does not violate any laws or infringe anyone’s rights." },
        { label: "Feedback: ", value: " If you choose to provide feedback, suggestions, or ideas about Ecosysteme.ai (for example, suggestions for new features or improvements), you agree that we are free to use and implement such feedback without any restriction or compensation to you. Feedback is entirely voluntary, and we are not obligated to use it.Please respect our intellectual property rights and those of others. This means you should not use Ecosysteme.ai’s name, logo, or trademarks without permission, and you should not remove or alter any proprietary notices in the platform. Likewise, do not use the service to misuse or misappropriate someone else’s intellectual property." }
        ]
    },
    point10: {
        header: "10. Privacy and Data Protection",
        description: "Your privacy is very important to us. Our collection, use, and disclosure of personal information in connection with the platform are described in our Privacy Policy (available on our website). By using the Ecosysteme.ai service, you agree that we can collect and use your information in accordance with our Privacy Policy. We strongly encourage you to read the Privacy Policy carefully.",
        label: "Here are some key points about privacy and data use;",
        points: ["We collect certain information from you when you use the service (such as account registration details and content you input) and we may also collect usage data as you interact with the platform. This information is used to provide the service, improve our features, and support you as a user.", "We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure, so we cannot guarantee absolute security. You are responsible for keeping your login credentials confidential.", "If you choose to use third-party integrations (as described in Section 7), some of your data may be shared with or transmitted through those third-party services. We are not responsible for how third-party services handle your data, so be sure to review their privacy policies as well.", "We will not sell your personal information to third parties. We do not share your personal data with third parties for their own marketing purposes without your explicit consent. We may share information with service providers under strict data protection agreements, or if required by law."],
    },
    point11: {
        header: "11. Disclaimers of Warranties",
        points: [{ label: `Provided “As-Is”: `, value: "Ecosysteme.ai and all of its features are provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we disclaim all warranties of any kind, whether express, implied, or statutory, regarding the service. This includes any implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, and any warranties that might arise from course of dealing or usage of trade. We do not guarantee that the service will meet your requirements or expectations." },
        { label: "No Guarantee of Results: ", value: " Using AI agents or any part of our service does not guarantee any particular results or outcomes. Any information or content generated by the platform is provided for general informational purposes. You acknowledge that AI-generated outputs may not be perfect, accurate, or suitable for your specific needs. You should review and use AI outputs with caution and not rely on them as professional advice (for example, legal, financial, or medical advice). You are responsible for any actions you take based on the information or results provided by the service." },
        { label: "Service Availability: ", value: "We strive to keep Ecosysteme.ai up and running, but we make no warranty that the service will be uninterrupted, timely, secure, or error-free. There may be occasional maintenance, updates, or technical issues that lead to temporary service interruptions. We will try to give advance notice of any significant downtime, but we are not liable for any interruptions or loss of data." },
        { label: "Accuracy and Data: ", value: "While we aim for accuracy, we do not warrant that any data or content provided on the platform (whether by us, by AI agents, or by users) is complete, reliable, or up-to-date. You are responsible for verifying the accuracy of any information obtained from the service before relying on it." },
        { label: "Third-Party Content: ", value: "Any third-party content or services accessed through Ecosysteme.ai (including through integrations or external links) are not under our control, and we are not responsible for them. We do not endorse and are not responsible for any content, advertising, products, or other materials on or available from third-party sites or services. If you access any third-party content or services, you do so at your own risk." }
        ],
        description: "Some jurisdictions do not allow the exclusion of certain warranties, so some of the above disclaimers may not apply to you. In such cases, any legally required warranties will apply to the minimum extent required by law."
    },
    point12: {
        header: "12. Limitation of Liability",
        points: [{ label: "Exceptions: ", value: "Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability will be limited to the greatest extent permitted by law. Nothing in these Terms is intended to exclude liability that cannot be excluded under law (for example, certain statutory warranties that may apply to consumers, or liability for intentional misconduct)." }],
        description: "You acknowledge that we are offering our service in reliance on the disclaimers of warranty and the limitations of liability stated above. These sections form an essential basis of the agreement between you and us. Without these provisions, the pricing and terms of service would likely be different."
    },
    point13: {
        header: "13. Changes to the Service and Terms",
        points: [{ label: "Changes to the Service: ", value: " Ecosysteme.ai is an evolving platform, and we may modify or discontinue (temporarily or permanently) any part of the service at any time. We reserve the right to add, change, or remove features or functionality of the platform. We will endeavor to notify users of major changes or discontinuations (for example, by posting an announcement or sending an email), but this may not always be possible. You agree that we will not be liable for any modification, suspension, or discontinuation of the service. If we discontinue the service in its entirety, we will provide notice to active subscribers and, if reasonably possible, allow you to export your data. If you have paid for a subscription that is still active at the time of a complete discontinuation, we will refund the unused portion of your subscription fee (this refund provision applies only in the event of a complete shutdown of the service)." }],
        description: "For clarity, no unilateral change to these Terms will retroactively modify the agreement between you and us; changes will only apply going forward. We encourage you to review the Terms periodically to stay informed about your rights and obligations."
    },
    point14: {
        header: "14. Governing Law and Jurisdiction",
        points: ["These Terms and any dispute or claim arising out of or related to them (including non-contractual disputes or claims) are governed by the laws of Switzerland, without regard to its conflict of law principles. By using the Ecosysteme.ai service, you agree that any disputes shall be resolved in the courts of Switzerland. We and you consent to the exclusive jurisdiction of the competent courts located in Switzerland for the resolution of any such disputes.", "If you are using the service as a consumer (for personal, non-business use) in a jurisdiction that provides you with the right to bring or defend claims in your local courts, this section does not limit any such rights you may have. In other words, these Terms are intended to be governed by Swiss law and jurisdiction except to the extent otherwise required by applicable consumer protection laws.", "Use of the Ecosysteme.ai platform is not authorized in any jurisdiction that does not give effect to all provisions of these Terms. If you access the service from outside Switzerland, you do so at your own risk and are responsible for compliance with local laws."]
    },
    point15: {
        header: "15. Miscellaneous",
        points: [{ label: "Entire Agreement: ", value: "These Terms (along with our Privacy Policy and any additional terms you agree to when using specific features or promotions) constitute the entire agreement between you and Ecosysteme.ai regarding the service and supersede all prior agreements or understandings (whether written or oral) relating to the same subject matter." },
        { label: "Waiver: ", value: "If we do not enforce any part of these Terms, it will not be considered a waiver of our rights. Any waiver of any provision of these Terms will be effective only if in writing and signed by us." },
        { label: "Severability: ", value: "If any provision of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, that provision will be interpreted to fulfill its intended purpose to the maximum extent permitted by law, and the remaining provisions will continue in full force and effect." },
        { label: "Assignment: ", value: "You may not assign or transfer your rights or obligations under these Terms to anyone else without our prior written consent. We may assign or transfer our rights and obligations under these Terms to an affiliate or in connection with a merger, acquisition, reorganization, or sale of assets, or by operation of law or otherwise. These Terms will bind and inure to the benefit of the parties, their successors, and permitted assigns." },
        { label: "No Third-Party Beneficiaries: ", value: " These Terms are solely for the benefit of you and Ecosysteme.ai. They are not intended to benefit any third party, and no third party shall have any rights as a beneficiary of these Terms except as may be expressly provided (for example, indemnified parties under certain provisions, if any)." },
        { label: "Headings: ", value: "The section titles and headings in these Terms are for convenience only and have no legal effect." }
        ]
    },
    point16: {
        header: "16. Contact Information"
    }
}


function TermsAndConditions() {
    const navigate = useNavigate()
    return (
        <div className="h-full overflow-auto w-full bg-[#F6F7F9]">
            <div className='flex justify-between p-4 items-center bg-[#E7E6F9]'>
                <div className="flex justify-center items-center gap-3 pl-6">
                    <div>
                        <img src={logo} alt="logo" className="object-fit" />
                    </div>
                </div>
                <div>
                    <button onClick={() => navigate("/")} className='bg-[#675FFF] cursor-pointer border border-[#5F58E8] px-3 py-2 rounded-lg text-[#fff] text-[16px] font-[500]'>
                        Log in
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-5 mb-3 mx-auto max-w-[1068px] px-2">
                <h2 className="text-[44px] font-[600] text-[#1E1E1E] flex justify-center mt-6">{staticData.header}</h2>
                <p className="text-[#5A687C] font-[400] text-[16px]">{staticData.lastDate} 13/05/2025</p>
                <p className="text-[#5A687C] font-[400] text-[16px]">{staticData.description}</p>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{staticData.point1.header}</h2>
                    <p className="text-[#5A687C] font-[400] text-[16px] my-2">By creating an account or using any services provided by <span className="text-[#1E1E1E] font-[700]">Ecosysteme.ai </span>(“<span className="text-[#1E1E1E] font-[700]">we</span>”, “<span className="text-[#1E1E1E] font-[700]">us</span>”, or “<span className="text-[#1E1E1E] font-[700]">our</span>”), you (“<span className="text-[#1E1E1E] font-[700]">you</span>” or “<span className="text-[#1E1E1E] font-[700]">User</span>
                        ”) agree to be bound by these Terms and Conditions (“<span className="text-[#1E1E1E] font-[700]">Terms</span>”). If you do not agree with these Terms, you must not use the Ecosysteme.ai platform or services. We may update these Terms from time to time by posting the revised Terms on our website and, if changes are significant, providing notice to users. Your continued use of the service after any changes means you accept the updated Terms.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point2.header}</h2>
                    {staticData.point2.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                    <p className="text-[#5A687C] font-[400]"><span className="text-[#675FFF] font-[700] text-[16px] cursor-pointer hover:underline">{staticData.point2.link} </span>{staticData.point2.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point3.header}</h2>
                    {staticData.point3.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point4.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point4.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point5.header}</h2>
                    {staticData.point5.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point6.header}</h2>
                    <p className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">Cancellation by You:<span className="text-[#5A687C] font-[400]"> You may cancel your subscription at any time through your account settings or by contacting us at </span><span className="text-[#675FFF] font-[400] cursor-pointer hover:underline">contact@ecosysteme.ai.</span><span className="text-[#5A687C] font-[400]"> Cancellation will take effect at the end of your current billing period. This means you will continue to have access to the service until the end of the period you have already paid for, but your subscription will not auto-renew thereafter. Please note that, per our No Refunds policy, cancelling will not retroactively refund any fees, and we will not prorate fees for the remaining portion of the billing period.</span></p>
                    {staticData.point6.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point7.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point7.description}</p>
                    {staticData.point7.points.map(each => (
                        <ul key={each.label} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[#1E1E1E] font-[700] text-[16px]" >{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></li>
                        </ul>
                    ))}
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point7.description2}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point8.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point8.description}</p>
                    {staticData.point8.points.map(each => (
                        <ul key={each.label} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[#1E1E1E] font-[700] text-[16px]" >{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></li>
                        </ul>
                    ))}
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point8.description2}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point9.header}</h2>
                    {staticData.point9.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point10.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point10.description}</p>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point10.label}</p>
                    {staticData.point10.points.map(each => (
                        <ul key={each} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[16px] text-[#5A687C] font-[400]">{each}</li>
                        </ul>
                    ))}
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">For more details on how we handle and protect your data, please refer to the Privacy Policy. If you have any questions or concerns about privacy, you can contact us at <span className="text-[#675FFF] cursor-pointer hover:underline font-[700]">contact@ecosysteme.ai</span> By using the service, you acknowledge that you have read and understood our Privacy Policy.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point11.header}</h2>
                    {staticData.point11.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point11.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point12.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">To the fullest extent permitted by law, <span className="text-[#1E1E1E] font-[700]">Ecosysteme.ai and its affiliates, officers, employees, agents, partners, and licensors will not be liable to you for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, or goodwill, arising</span> out of or related to your use of (or inability to use) the platform or services. This limitation applies to any theory of liability (whether based in contract, tort, negligence, strict liability, or otherwise) and even if we have been advised of the possibility of such damages. You assume all risks associated with your use of the service.</p>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">In no event will our total cumulative liability for all claims arising from or related to the service exceed the amount you have paid to Ecosysteme.ai in subscription fees in the <span className="text-[#1E1E1E] font-[700]"> twelve (12) months</span> immediately prior to the event giving rise to the liability (or, if you have not paid any subscription fees, the amount of CHF 0). This means that if, for example, you have paid us CHF 100 in the past year, our maximum total liability to you for any and all claims will be CHF 100.</p>
                    {staticData.point12.points.map(each => (
                        <ul key={each.label} style={{ listStyleType: "disc" }} className="pl-6">
                            <li className="mb-1 text-[#1E1E1E] font-[700] text-[16px]" >{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></li>
                        </ul>
                    ))}
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point12.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point13.header}</h2>
                    {staticData.point13.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                    <p className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">Changes to Terms: <span className="text-[#5A687C] font-[400]">We may revise these Terms from time to time. When we make material changes, we will notify you by, for example, sending an email to the address associated with your account or by displaying a prominent notice on our site. The updated Terms will be indicated by an updated “Last Updated” date at the top. </span>By continuing to use the service after the new Terms become effective, you agree to be bound by the revised Terms. <span className="text-[#5A687C] font-[400]">If you do not agree to any updated Terms, you must stop using the service and cancel your subscription.</span></p>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">{staticData.point13.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point14.header}</h2>
                    {staticData.point14.points.map(each => (
                        <p key={each} className="mb-1 text-[16px] text-[#5A687C] font-[400]">{each}</p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point15.header}</h2>
                    {staticData.point15.points.map(each => (
                        <p key={each.label} className="mb-1 text-[#1E1E1E] font-[700] text-[16px]">{each.label}<span className="text-[#5A687C] font-[400]">{each.value}</span></p>
                    ))}
                </div>
                <div className="flex flex-col gap-2 mb-5">
                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-2">{staticData.point16.header}</h2>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">If you have any questions, concerns, or feedback about these Terms or the Ecosysteme.ai service, please feel free to contact us at <span className="text-[#675FFF] font-[700] cursor-pointer hover:underline">contact@ecosysteme.ai. </span>We value communication with our users and will do our best to address your inquiry promptly.</p>
                    <p className="mb-1 text-[#5A687C] font-[400] text-[16px]">By using Ecosysteme.ai, you acknowledge that you have read, understood, and agree to these Terms and Conditions. Thank you for choosing Ecosysteme.ai!</p>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions
