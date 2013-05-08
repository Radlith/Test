using UnityEngine;
using System.Collections;

public class WanderingMob : BaseMobCS {

  public float levelImpactDamageMultiplier = 1;
  public float impactDamage = 1;
  public Vector3 currentAcceleration;

	// Use this for initialization
	public override void Start () {
    base.Start();
	}
	
	// Update is called once per frame
	public override void Update () {
    base.Update();
    
	}

  public override void FixedUpdate()
  {
    base.FixedUpdate();
    rigidbody.AddForce(currentAcceleration);
  }

  public void OnTriggerEnter(Collider other)
  {
    BaseHealthCS collisionHealth;
		
		//Only can damage the player, don't take damage unless actually hitting the player
		
		if((other.gameObject.layer) == LayerMask.NameToLayer("PlayerShip"))
		{
			collisionHealth = (BaseHealthCS) other.gameObject.GetComponent(typeof(BaseHealthCS));
			if(collisionHealth)
			{
				collisionHealth.ReceiveDamage(impactDamage);
				if((BaseHealthCS) GetComponent(typeof(BaseHealthCS)))
				{
					((BaseHealthCS) GetComponent(typeof(BaseHealthCS))).ReceiveDamage(impactDamage);
				}
			}
		}
  }

  public void OnTriggerStay(Collider other)
  {
    BaseHealthCS collisionHealth;

    //Only can damage the player, don't take damage unless actually hitting the player

    if ((other.gameObject.layer) == LayerMask.NameToLayer("PlayerShip"))
    {
      collisionHealth = (BaseHealthCS)other.gameObject.GetComponent(typeof(BaseHealthCS));
      if (collisionHealth)
      {
        collisionHealth.ReceiveDamage(impactDamage);
        if ((BaseHealthCS)GetComponent(typeof(BaseHealthCS)))
        {
          ((BaseHealthCS)GetComponent(typeof(BaseHealthCS))).ReceiveDamage(impactDamage);
        }
      }
    }
  }

  public override void AIUpdate()
  {
    currentAcceleration = Random.insideUnitCircle * accelerationPower * Random.value;
    currentAcceleration.z = currentAcceleration.y;
    currentAcceleration.y = 0;
  }
}
